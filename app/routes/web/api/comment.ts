import { redirect } from 'react-router'

import { auth } from '~/lib/auth/auth.server'
import { db } from '~/lib/db/db.server'
import { comment } from '~/lib/db/schema/comment'

/**
 * encType: form
 * {
 * 	restaurantId: string;
 * 	content: string; // 留言內容
 * }
 */
export async function action({ request }: { request: Request }) {
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const user = session.user
	const formData = await request.formData()
	const restaurantId = formData.get('restaurantId')?.toString()
	const content = formData.get('content')?.toString()

	if (!restaurantId || !content) {
		return { err: '請提供餐廳ID和留言內容' }
	}

	// 只能留言一次
	const exists = await db.query.comment.findFirst({
		where: (c, { eq, and }) =>
			and(eq(c.restaurantId, restaurantId), eq(c.userId, user.id)),
	})
	if (exists) {
		return { err: '你已經留言過了' }
	}

	const result = await db
		.insert(comment)
		.values({
			userId: user.id,
			restaurantId,
			content,
		})
		.returning()

	return { msg: '留言成功', data: result[0] }
}
