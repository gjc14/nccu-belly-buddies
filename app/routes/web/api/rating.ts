/** 對特定餐廳評分
 * 網址：http://localhost:5173/api/rating/123
 * /api/rating 是固定的，後面的 123 是變數，從 params.id 取得這個變數，請見 loader/action 的使用方法
 * 我有在 app/routes/web/routes.ts 設定 /:id
 * （「:id」表示變數名稱是 id 的變數，可以從 params.id 取得，也可以是「:ratingId」，那 params 就要用 params.ratingId 取得）
 */

import { redirect } from 'react-router'

import { auth } from '~/lib/auth/auth.server'

import type { Route } from './+types/rating'

// action 負責處理 POST、PUT、DELETE request
export async function action({ request, params }: Route.ActionArgs) {
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const ratingId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	// 以下可以開始處理 user 與 rating id
	// ...

	switch (request.method) {
		case 'POST':
			// 處理 POST 請求，通常是用來創建新的資源
			break
		case 'PUT':
			// 處理 PUT 請求，通常是用來更新現有的資源
			break
		case 'DELETE':
			// 處理 DELETE 請求，通常是用來刪除資源
			break
		default:
			throw new Response('', {
				status: 405,
				statusText: 'Method Not Allowed',
			})
	}

	// 返回資料
	return {
		api: '群組',
		id: ratingId,
	}
}

// Loader 負責處理 GET request
export async function loader({ request, params }: Route.LoaderArgs) {
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const ratingId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	// 以下可以開始處理 user 與 rating id
	// ...

	// 返回資料
	return {
		api: '群組',
		id: ratingId,
	}
}
