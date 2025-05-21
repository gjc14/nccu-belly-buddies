import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node'
import { db } from '~/lib/db/db.server'
import { group, groupMember, restaurant, user } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'

//  餐廳清單查詢
export const loader: LoaderFunction = async () => {
  const restaurants = await db.select().from(restaurant)
  return json({ restaurants })
}

//  建立、修改、刪除群組 API
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const _method = formData.get('_method')?.toString().toUpperCase() ?? 'POST'

  const groupId = formData.get('groupId') as string | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const creatorId = formData.get('creatorId') as string
  const restaurantID = formData.get('restaurantID') as string
  const startTime = formData.get('startTime') as string
  const numofPeople = parseInt(formData.get('numofPeople') as string)
  const foodPreference = formData.get('foodPreference') as string
  const proposedBudget = parseInt(formData.get('proposedBudget') as string)

  const costPerPerson = (!isNaN(proposedBudget) && !isNaN(numofPeople) && numofPeople > 0)
    ? Math.round(proposedBudget / numofPeople)
    : null

  switch (_method) {
    case 'POST': {
      if (!name || !creatorId || !restaurantID || !startTime || isNaN(numofPeople)) {
        return json({ error: '缺少必要欄位' }, { status: 400 })
      }

      const [newGroup] = await db
        .insert(group)
        .values({
          name,
          description,
          creatorId,
          restaurantID,
          startTime: new Date(startTime),
          numofPeople,
          foodPreference,
          proposedBudget: isNaN(proposedBudget) ? undefined : proposedBudget,
        })
        .returning({ id: group.id })

      //  建立者自動加入 groupMember 表
      await db.insert(groupMember).values({
        groupId: newGroup.id,
        userId: creatorId,
      })

      return redirect('/success')
    }

    case 'PATCH': {
      if (!groupId || typeof groupId !== 'string') {
        return json({ error: 'groupId 必填且需為字串' }, { status: 400 })
      }

      await db.update(group)
        .set({
          name,
          description,
          restaurantID,
          startTime: startTime ? new Date(startTime) : undefined,
          numofPeople: isNaN(numofPeople) ? undefined : numofPeople,
          foodPreference,
          proposedBudget: isNaN(proposedBudget) ? undefined : proposedBudget,
        })
        .where(eq(group.id, groupId))

      return json({ success: true, message: '群組已更新' })
    }

    case 'DELETE': {
      if (!groupId || typeof groupId !== 'string') {
        return json({ error: 'groupId 必填且需為字串' }, { status: 400 })
      }

      await db.delete(group).where(eq(group.id, groupId))
      return json({ success: true, message: '群組已刪除' })
    }

    default:
      return json({ error: '不支援的 _method 方法' }, { status: 405 })
  }
}
