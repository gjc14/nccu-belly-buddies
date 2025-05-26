/** 餐廳
 * 網址：http://localhost:5173/api/restaurant/123
 * /api/restaurant 是固定的，後面的 123 是變數，從 params.id 取得這個變數，請見 loader/action 的使用方法
 * 我有在 app/routes/web/routes.ts 設定 /:id
 * （「:id」表示變數名稱是 id 的變數，可以從 params.id 取得，也可以是「:restaurantId」，那 params 就要用 params.restaurantId 取得）
 */

import { eq } from 'drizzle-orm'

import { db } from '~/lib/db/db.server'
import { restaurant } from '~/lib/db/schema'
import type { ConventionalActionResponse } from '~/lib/utils'
import { validateAdminSession } from '~/routes/papa/auth/utils'

import type { Route } from './+types/restaurant'

// action 負責處理 POST、PUT、DELETE request
export async function action({ request, params }: Route.ActionArgs) {
	// 如果沒有登入，重新導向登入頁面
	const adminSession = await validateAdminSession(request)

	const admin = adminSession.user

	const restaurantId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	// 以下可以開始處理 user 與 restaurant id
	// ...

	switch (request.method) {
		case 'POST':
			// 處理 POST 請求，通常是用來創建新的資源

			const formData = await request.formData()
			const name = formData.get('name')?.toString()
			const description = formData.get('description')?.toString()
			const address = formData.get('address')?.toString()
			const phone = formData.get('phone')?.toString()
			const openingHours = formData.get('openingHours')?.toString()
			const cuisineType = formData.get('cuisineType')?.toString()
			const priceRange = formData.get('priceRange')?.toString()
			const rating = Number(formData.get('rating'))

			if (
				!name ||
				!description ||
				!address ||
				!phone ||
				!openingHours ||
				!cuisineType ||
				!priceRange ||
				isNaN(rating)
			) {
				return {
					err: '請提供完整的餐廳資訊',
				} satisfies ConventionalActionResponse
			}

			const newRestaurant = await db
				.insert(restaurant)
				.values({
					name,
					description,
					address,
					phone,
					openingHours,
					cuisineType,
					priceRange,
					rating,
				})
				.returning()

			return {
				msg: `餐廳 ${newRestaurant[0].name} 已成功創建`,
			} satisfies ConventionalActionResponse
		case 'DELETE':
			// 處理 DELETE 請求，通常是用來刪除資源

			const restaurantDeleted = await db
				.delete(restaurant)
				.where(eq(restaurant.id, restaurantId))
				.returning()

			return {
				msg: `餐廳 ${restaurantDeleted[0].name} 已成功刪除`,
			}
		default:
			throw new Response('', {
				status: 405,
				statusText: 'Method Not Allowed',
			})
	}
}

// Loader 負責處理 GET request
export async function loader({ request, params }: Route.LoaderArgs) {
	if (!params.id && params.id !== 'all') {
		throw new Response('Restaurant ID is required', {
			status: 400,
			statusText: 'Bad Request',
		})
	}
	const restaurants = await db.query.restaurant.findMany()

	return { restaurants }
}
