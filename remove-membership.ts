// 在終端機執行 tsx mockdata.ts 來執行這個檔案，會將假資料插入到資料庫中。
// 🔧 匯入必要的套件
import { db } from '~/lib/db/db.server' // 資料庫連線設定

import 'dotenv/config' // 讀取 .env 中的 DATABASE_URL

import { groupMember } from '~/lib/db/schema'

async function run() {
	await db.delete(groupMember)

	console.log('群組成員資料已清除')
}

run()
