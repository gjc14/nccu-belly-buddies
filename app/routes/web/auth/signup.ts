import { db } from '~/lib/db/db.server'
import * as schema from '~/lib/db/schema'
import bcrypt from 'bcrypt'
import type { ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json()
  const { email, password } = body

  // 檢查有沒有填 email 和 password
  if (!email || !password) {
    return new Response('缺少 email 或 password', { status: 400 })
  }

  // 檢查這個 email 是否已經註冊
  const exists = await db.query.accounts.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  })

  if (exists) {
    return new Response('此 Email 已被註冊', { status: 409 })
  }

  // 對密碼加密
  const hashedPassword = await bcrypt.hash(password, 10)

  // 寫入資料庫
  const result = await db.insert(schema.accounts).values({
    email,
    password: hashedPassword,
  })

  return {
    msg: '註冊成功',
    data: result,
  }
}
