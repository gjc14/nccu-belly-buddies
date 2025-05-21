import { db } from '~/lib/db/db.server'
import * as schema from '~/lib/db/schema'
import bcrypt from 'bcrypt'
import { redirect } from 'react-router'
import type { ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json()
  const { email, password } = body

  // 取得帳號資料
  const user = await db.query.accounts.findFirst({
    where: (account, { eq }) => eq(account.email, email),
  })

  if (!user) {
    return new Response('帳號不存在', { status: 404 })
  }

  // 比對密碼
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return new Response('密碼錯誤', { status: 401 })
  }

  // 這裡可以建立 session 或直接回傳登入成功
  return {
    msg: '登入成功',
    user: {
      id: user.id,
      email: user.email,
    },
  }
}
