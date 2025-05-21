import { redirect, json } from '@remix-run/node'
import { db } from '~/lib/db/db.server'
import { auth } from '~/lib/auth/auth.server'
import { group } from '~/lib/db/schema/group'
import { restaurant } from '~/lib/db/schema/restaurant'
import { groupMember } from '~/lib/db/schema/group'
import { eq, and, sql } from 'drizzle-orm'

// 群組 CRUD 操作
export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const session = await auth.api.getSession(request)
  if (!session) throw redirect('/auth')

  const user = session.user
  const groupId = params.id

  const formData = await request.formData()
  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const restaurantID = formData.get('restaurantID')?.toString()
  const startTime = formData.get('startTime')?.toString()
  const foodPreference = formData.get('foodPreference')?.toString()
  const numOfPeople = Number(formData.get('numOfPeople'))
  const proposedBudget = Number(formData.get('proposedBudget'))

  switch (request.method) {
    case 'POST': {
      if (!name || !numOfPeople || !proposedBudget) {
        return json({ error: '請填寫必填欄位' }, { status: 400 })
      }

      const createdGroup = await db.insert(group).values({
        name,
        description,
        restaurantID,
        startTime: startTime ? new Date(startTime) : undefined,
        foodPreference,
        numofPeople: numOfPeople,
        proposedBudget: proposedBudget.toString(),
        creatorId: user.id,
        status: 'active',
      }).returning()

      await db.insert(groupMember).values({
        groupId: createdGroup[0].id,
        userId: user.id,
        userName: user.name,
        role: 'Admin',
      })

      return json({ msg: '群組已建立，管理員已加入', group: createdGroup[0] })
    }

    case 'PUT': {
      const existingGroup = await db.query.group.findFirst({
        where: (g, { eq }) => eq(g.id, groupId),
      })

      if (!existingGroup) return json({ error: '找不到群組' }, { status: 404 })
      if (existingGroup.creatorId !== user.id) return json({ error: '非創建者無法修改' }, { status: 403 })
      if (existingGroup.status === 'completed') return json({ error: '群組已完成，無法修改' }, { status: 403 })

      await db.update(group).set({
        name,
        description,
        restaurantID,
        startTime: startTime ? new Date(startTime) : undefined,
        foodPreference,
        numofPeople,
        proposedBudget: proposedBudget.toString(),
      }).where(eq(group.id, groupId))

      return json({ msg: '群組已更新' })
    }

    case 'DELETE': {
      const currentAdmin = await db
        .select({ role: groupMember.role })
        .from(groupMember)
        .where(and(eq(groupMember.userId, user.id), eq(groupMember.groupId, groupId)))

      if (currentAdmin[0]?.role === 'Admin') {
        const action = formData.get('action')?.toString()
        const newAdminId = formData.get('newAdminId')?.toString()

        if (action === 'delete') {
          await db.delete(group).where(eq(group.id, groupId))
          await db.delete(groupMember).where(eq(groupMember.groupId, groupId))
          return json({ msg: '群組已刪除' })
        } else if (action === 'assign') {
          let earliestMember: { userId: string }[] = []

          if (newAdminId) {
            await db.update(groupMember)
              .set({ role: 'Admin' })
              .where(and(eq(groupMember.userId, newAdminId), eq(groupMember.groupId, groupId)))
          } else {
            earliestMember = await db.select({ userId: groupMember.userId })
              .from(groupMember)
              .where(eq(groupMember.groupId, groupId))
              .orderBy(sql`created_at ASC`).limit(1)

            if (earliestMember.length > 0) {
              await db.update(groupMember)
                .set({ role: 'Admin' })
                .where(and(eq(groupMember.userId, earliestMember[0].userId), eq(groupMember.groupId, groupId)))
            }
          }

          await db.delete(groupMember)
            .where(and(eq(groupMember.userId, user.id), eq(groupMember.groupId, groupId)))

          return json({ msg: '管理員已更新', data: newAdminId || earliestMember[0]?.userId })
        }
      }

      return json({ error: '非管理員無法刪除或轉讓群組' }, { status: 403 })
    }

    default:
      throw new Response('', { status: 405 })
  }
}

// 查詢群組資料（含每人預算與所有餐廳選單）
export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  const session = await auth.api.getSession(request)
  if (!session) throw redirect('/auth')

  const groupId = params.id
  const data = await db.query.group.findFirst({
    where: (g, { eq }) => eq(g.id, groupId),
  })

  if (!data) return json({ error: '找不到群組' }, { status: 404 })

  const restaurants = await db.select().from(restaurant)
  const perPersonCost =
    data.numofPeople && data.proposedBudget
      ? Number(data.proposedBudget) / data.numofPeople
      : null

  return json({ group: data, perPersonCost, restaurants })
}
