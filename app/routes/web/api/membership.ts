import { redirect } from 'react-router'
import { auth } from '~/lib/auth/auth.server'
import { db } from '~/lib/db/db.server'
import { groupMember } from '~/lib/db/schema/group'
import { eq, and } from 'drizzle-orm'

export async function action({ request, params }: { request: Request; params: { id: string } }) {
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const user = session.user
	const groupId = params.id

	switch (request.method) {
		case 'POST': {
			await db.insert(groupMember).values({
				groupId,
				userId: user.id,
			})
			return { msg: '成功加入群組' }
		}
		case 'DELETE': {
			await db.delete(groupMember).where(and(
				eq(groupMember.groupId, groupId),
				eq(groupMember.userId, user.id)
			))
			return { msg: '已退出群組' }
		}
		default:
			throw new Response('', { status: 405 })
	}
}
