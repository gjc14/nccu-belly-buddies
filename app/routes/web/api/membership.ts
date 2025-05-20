/** 組員
 * 網址：http://localhost:5173/api/membership/123
 * /api/membership 是固定的，後面的 123 是變數，從 params.id 取得這個變數，請見 loader/action 的使用方法
 * 我有在 app/routes/web/routes.ts 設定 /:id
 * （「:id」表示變數名稱是 id 的變數，可以從 params.id 取得，也可以是「:membershipId」，那 params 就要用 params.membershipId 取得）
 */

import { redirect } from 'react-router'

import { auth } from '~/lib/auth/auth.server'

import type { Route } from './+types/membership'
import { eq, and} from 'drizzle-orm'
import { db } from '~/lib/db/db.server'
import * as schema from '~/lib/db/schema'
import type { ConventionalActionResponse } from '~/lib/utils'

// action 負責處理 POST、PUT、DELETE request
export async function action({ request, params }: Route.ActionArgs) {
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const membershipId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	// 以下可以開始處理 user 與 membership id
	// ...

	switch (request.method) {
		case 'POST':
			const newMember = await db.insert(schema.groupMember).values({
				groupId: schema.group.id,
				userId: user.id,
				userName: user.name,
			})
			return {
				msg: '新成員已加入',
				data: newMember,
			} satisfies ConventionalActionResponse

		case 'PUT':
			const updatedMember = await db
        		.update(schema.groupMember)
        		.set({ role: 'Admin' })
        		.where(
            		and(
                		eq(schema.groupMember.userId, user.id),
                		eq(schema.groupMember.groupId, schema.group.id)
            	)
        	);
    return {
        msg: '成員已升級為管理員',
        data: updatedMember,
    } satisfies ConventionalActionResponse

		case 'DELETE':
            const leaveGroup = await db
                .delete(schema.groupMember)
                .where(
                    and(
                        eq(schema.groupMember.userId, user.id),
                        eq(schema.groupMember.groupId, schema.group.id)
                    )
                );

            return {
                msg: '成員已退出',
                data: leaveGroup,
            } satisfies ConventionalActionResponse
		default:
			throw new Response('', {
				status: 405,
				statusText: 'Method Not Allowed',
			})
	}

// Loader 負責處理 GET request
export async function loader({ request, params }: Route.LoaderArgs) {
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const membershipId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	 // 我有在 app/routes/web/routes.ts 設定 /:groupId
	// 以下可以開始處理 user 與 membership id
	// ...

	const membership = await db.query.groupMember.findFirst({
        where: (groupMemberTable, { eq }) => eq(groupMemberTable.id, membershipId),
        with: {
            group: true, // Include group details
            user: true,  // Include user details
        },
    });

	// 返回資料
	return {
		api: '成員',
		id: membershipId,
		membership: membership
	}
}
