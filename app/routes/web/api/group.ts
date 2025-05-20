/** 群組
 * 網址：http://localhost:5173/api/group/123
 * /api/group 是固定的，後面的 123 是變數，從 params.id 取得這個變數，請見 loader/action 的使用方法
 * 我有在 app/routes/web/routes.ts 設定 /:id
 * （「:id」表示變數名稱是 id 的變數，可以從 params.id 取得，也可以是「:groupId」，那 params 就要用 params.groupId 取得）
 */

import { redirect } from 'react-router'

import { eq, and, sql } from 'drizzle-orm'

import { auth } from '~/lib/auth/auth.server'
import { db } from '~/lib/db/db.server'
import * as schema from '~/lib/db/schema'
import type { ConventionalActionResponse } from '~/lib/utils'

import type { Route } from './+types/group'

// action 負責處理 POST、PUT、DELETE request
export async function action({ request, params }: Route.ActionArgs) {
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')
	
	const groupId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	// 以下可以開始處理 user 與 group id
	// ...

	switch (request.method) {
		case 'POST':
			// 處理 POST 請求，通常是用來創建新的資源
			// 例如：
			const newGroup = await db.insert(schema.group).values({
				name: '新群組',
				description: '這是一個新的群組',
				creatorId: user.id,
				// ...其他欄位
			})
			
			const addAdmin = await db.insert(schema.groupMember).values({
				groupId: groupId,
				userId: user.id,
				userName: user.name,
				role:'Admin'
			})

			return {
				msg: '群組已創建，管理員已加入',
				data: {
					group:newGroup, 
					admin:addAdmin,
				},
			} satisfies ConventionalActionResponse

		case 'PUT':
			// 處理 PUT 請求，通常是用來更新現有的資源
			// 例如：
			const updatedGroup = await db
				.update(schema.group)
				.set({
					name: '更新後的群組名稱',
					description: '這是更新後的群組描述',
					// ...其他欄位
				})
				.where(eq(schema.group.id, groupId)) // 記得使用 where，不然所有資料都會變成 passed in value
			// .where 的使用方式是：從 schemas 中找到 group 的 schema，然後 group table(schema) 的 id 要等於傳入的 groupId

			return {
				msg: '群組已更新',
				data: updatedGroup,
			} satisfies ConventionalActionResponse
		case 'DELETE':
			// 處理 DELETE 請求，通常是用來刪除資源
			// 例如：
			//const deletedGroup = await db
			//	.delete(schema.group)
			//	.where(eq(schema.group.id, groupId)) // 記得使用 where，不然所有資料都會被刪掉

			//return {
			//	msg: '群組已刪除',
			//	data: deletedGroup,
			//} satisfies ConventionalActionResponse
    		
			//管理員退出群組可選擇刪除或變更管理員
			const currentAdmin = await db
        		.select({ role: schema.groupMember.role })
        		.from(schema.groupMember)
        		.where(
            		and(
                		eq(schema.groupMember.userId, user.id),
                		eq(schema.groupMember.groupId, groupId)
           	 	)
        	);

    		if (currentAdmin[0]?.role === 'Admin') {
       		 // Check if the admin has chosen to delete the group
        	const formData = await request.formData();
		const action = formData.get('action'); // 'delete' or 'assign'
		const newAdminId = formData.get('newAdminId'); // Optional new admin ID
		let earliestMember: { userId: string }[] = []; // Declare earliestMember 

		if (action === 'delete') {
			// Delete the group
			await db.delete(schema.group).where(eq(schema.group.id, groupId));
			await db.delete(schema.groupMember).where(eq(schema.groupMember.groupId, groupId));

			return {
				msg: '群組已刪除',
			} satisfies ConventionalActionResponse

		} else if (action === 'assign') {
			if (newAdminId) {
				// Assign the chosen member as the new admin
				await db
					.update(schema.groupMember)
					.set({ role: 'Admin' })
					.where(
						and(
							eq(schema.groupMember.userId, newAdminId),
							eq(schema.groupMember.groupId, groupId)
						)
					);
			} else {
				// Automatically assign the earliest member as the new admin
				earliestMember = await db
					.select({ userId: schema.groupMember.userId })
					.from(schema.groupMember)
					.where(eq(schema.groupMember.groupId, groupId))
					.orderBy(sql`${schema.groupMember.timestampAttributes} ASC`)
					.limit(1);

				if (earliestMember.length > 0) {
					await db
						.update(schema.groupMember)
						.set({ role: 'Admin' })
						.where(
							and(
								eq(schema.groupMember.userId, earliestMember[0].userId),
								eq(schema.groupMember.groupId, groupId)
							)
						);
				}
			}

			// Remove the current admin from the group
			await db
				.delete(schema.groupMember)
				.where(
					and(
						eq(schema.groupMember.userId, user.id),
						eq(schema.groupMember.groupId, groupId)
					)
				);

			return {
				msg: '管理員已更新',
				data: newAdminId || earliestMember[0]?.userId,
			} satisfies ConventionalActionResponse;
		}
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
	// 如果沒有登入，重新導向登入頁面
	const session = await auth.api.getSession(request)
	if (!session) throw redirect('/auth')

	const groupId = params.id // 我有在 app/routes/web/routes.ts 設定 /:id
	const user = session.user
	// 以下可以開始處理 user 與 group id
	// ...

	const group = await db.query.group.findFirst({
		where: (groupTable, { eq }) => eq(groupTable.id, groupId),
	})

	// 返回資料給前端第一次頁面顯示所需要的內容，例如用 groupId 取得 group
	return {
		api: '群組',
		id: groupId,
		group: group,
	}
}
