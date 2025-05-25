import { redirect } from 'react-router'

import { auth } from '~/lib/auth/auth.server'
import { db } from '~/lib/db/db.server'
import { rating } from '~/lib/db/schema/rating'

/**
 * encType: form
 * {
 * 	restaurantId: string;
 *  score: number; // 1-5
 * }
 * @returns
 */
export async function action({ request }: { request: Request }) {
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const user = session.user
	const formData = await request.formData()
	const restaurantId = formData.get('restaurantId')?.toString()
	const score = Number(formData.get('score'))

	if (!restaurantId || !score) {
		return { err: '請提供餐廳ID和評分' }
	}

	// 只能評一次
	const exists = await db.query.rating.findFirst({
		where: (r, { eq, and }) =>
			and(eq(r.restaurantId, restaurantId), eq(r.userId, user.id)),
	})
	if (exists) {
		return { err: '你已經評分過了' }
	}

	const result = await db
		.insert(rating)
		.values({
			userId: user.id,
			restaurantId,
			score,
		})
		.returning()

	return { msg: '評分成功', data: result[0] }
}
