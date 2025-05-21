// 匯入 bcrypt 用來加密密碼
import bcrypt from 'bcrypt';

// 匯入我們自己建立的 drizzle 資料庫連線（連的是 Neon）
import { db } from '../db';

// 匯入 drizzle 定義的資料表 schema（accounts 對應到資料庫的 accounts 表）
import { accounts } from '../schema';

// drizzle 的查詢條件工具（eq = equal）
import { eq } from 'drizzle-orm';

/**
 * 使用者註冊功能
 * @param accountId 使用者的帳號（通常是 email 或 username）
 * @param password 使用者的明文密碼
 * @returns 成功註冊訊息
 */
export async function registerUser(accountId: string, password: string) {
  // 🔎 1. 先檢查資料庫中是否已經有這個帳號
  const exists = await db
    .select()
    .from(accounts)
    .where(eq(accounts.account_id, accountId));

  if (exists.length > 0) {
    // 如果查詢結果不為空，表示帳號已存在，直接拋出錯誤
    throw new Error('帳號已存在');
  }

  // 🔐 2. 使用 bcrypt 將明文密碼加密（hash）
  const passwordHash = await bcrypt.hash(password, 10); // 10 是 salt round，值越大越安全但越慢

  // 🧾 3. 寫入新帳號資料到資料庫 accounts 表
  await db.insert(accounts).values({
    id: crypto.randomUUID(),        // 使用內建的 UUID 當作主鍵 ID（你也可以用 nanoid）
    account_id: accountId,          // 使用者輸入的帳號
    password: passwordHash,         // 加密後的密碼
    created_at: new Date(),         // 記錄建立時間
    updated_at: new Date()          // 記錄更新時間（可以跟 created_at 相同）
  });

  // ✅ 4. 回傳成功訊息
  return { message: '註冊成功' };
}

//------

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // 匯入你的 drizzle schema 定義

// 從環境變數讀取資料庫連線網址（.env 裡設 DATABASE_URL）
const sql = neon(process.env.DATABASE_URL!);

// 建立 drizzle ORM 實例，讓我們能透過 db 來操作資料庫
export const db = drizzle(sql, { schema });


//---


import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// 定義資料表名稱 accounts，與資料庫中的表對應
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),                 // 主鍵 ID，這裡用 text 類型 UUID
  account_id: text('account_id').notNull(),    // 使用者帳號
  password: text('password').notNull(),        // 加密後密碼
  created_at: timestamp('created_at'),         // 建立時間
  updated_at: timestamp('updated_at')          // 更新時間
});
