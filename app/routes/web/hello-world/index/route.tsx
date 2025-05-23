import {
  json,
  type LoaderFunction,
  type ActionFunction
} from "@remix-run/node"
import { db } from "~/db/group.server"
import { restaurant } from "~/db/schema/restaurant"
import { group } from "~/db/schema/group"

// ✅ GET：查詢所有餐廳
export const loader: LoaderFunction = async () => {
  const restaurants = await db.select().from(restaurant)
  return json({ restaurants })
}

// ✅ POST：建立群組
export const action: ActionFunction = async ({ request }) => {
  const body = await request.json()
  const { name, creatorId, restaurantID } = body

  if (!name || !creatorId || !restaurantID) {
    return json({ error: "name, creatorId, restaurantID 為必填" }, { status: 400 })
  }

  const result = await db.insert(group).values({
    name,
    creatorId,
    restaurantID,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return json({ success: true, groupId: result[0]?.id })
}

// ✅ 畫面 UI：保留原來的前端畫面
export default function Index() {
  return (
    <div className="border-2 p-4">
      <p>
        This content is from <strong>index.tsx</strong> file.
      </p>
      <p className="text-sm text-gray-500">
        現在這個 route.tsx 同時也支援 <code>GET</code> 查餐廳 + <code>POST</code> 建群組 API！
      </p>
    </div>
  )
}

