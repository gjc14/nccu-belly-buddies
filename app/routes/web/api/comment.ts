import { json, redirect } from '@remix-run/node'
import { db } from '~/lib/db/db.server'
import { comment } from '~/lib/db/schema/comment'
import { eq, and } from 'drizzle-orm'
import { auth } from '~/lib/auth/auth.server'

export async function action({ request }: { request: Request }) {
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const user = session.user
	const formData = await request.formData()
	const restaurantId = formData.get('restaurantId')?.toString()
	const content = formData.get('content')?.toString()

	// 只能留言一次
	const exists = await db.query.comment.findFirst({
		where: (c, { eq, and }) => and(
			eq(c.restaurantId, restaurantId),
			eq(c.userId, user.id)
		),
	})
	if (exists) {
		return json({ error: '你已經留言過了' }, { status: 400 })
	}

	const result = await db.insert(comment).values({
		userId: user.id,
		restaurantId,
		content,
	}).returning()

	return json({ msg: '留言成功', comment: result[0] })
}
