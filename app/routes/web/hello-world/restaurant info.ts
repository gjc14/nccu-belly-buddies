// 🔧 匯入必要的套件
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import 'dotenv/config'; // 讀取 .env 中的 DATABASE_URL

// 🗃️ 定義 restaurant 資料表 schema（符合你之前的 schema 結構）
const restaurant = pgTable('restaurant', {
  id: uuid('res_id').defaultRandom().primaryKey(),       // 主鍵，UUID，自動生成
  name: text('res_name').notNull(),                      // 餐廳名稱
  description: text('res_description'),                  // 餐廳描述
  address: text('address').notNull(),                    // 地址
  phone: text('phone'),                                  // 電話
  openingHours: text('opening_hours'),                   // 營業時間
  cuisineType: text('cuisine_type'),                     // 菜系
  priceRange: text('price_range'),                       // 價格區間（$ ~ $$$）
  rating: integer('rating'),                             // 評分（整數）
  chefNationality: text('chef_nationality')              // 廚師國籍（新增欄位）
});

// 🔗 建立資料庫連線（使用 Neon HTTP + Drizzle）
const sql = neon(process.env.DATABASE_URL!); // 請在 .env 檔案中設定 DATABASE_URL
const db = drizzle(sql, { schema: { restaurant } });

// 🍽️ 要插入的餐廳假資料（共 10 筆）
const restaurantData = [
  {
    name: "山海樓",
    description: "精緻台菜料理",
    address: "台北市中正區仁愛路1號",
    phone: "02-1234-5678",
    openingHours: "11:00–21:00",
    cuisineType: "台菜",
    priceRange: "$$",
    rating: 5,
    chefNationality: "台灣"
  },
  {
    name: "鮨一郎",
    description: "日本壽司名店",
    address: "台中市西區精誠路88號",
    phone: "04-7654-3210",
    openingHours: "12:00–22:00",
    cuisineType: "日本料理",
    priceRange: "$$$",
    rating: 4,
    chefNationality: "日本"
  },
  {
    name: "火鍋工坊",
    description: "平價吃到飽火鍋",
    address: "高雄市三民區建工路99號",
    phone: "07-1122-3344",
    openingHours: "17:00–23:00",
    cuisineType: "火鍋",
    priceRange: "$",
    rating: 3,
    chefNationality: "台灣"
  },
  {
    name: "Pasta Mia",
    description: "義式家庭風味料理",
    address: "新北市板橋區文化路88號",
    phone: "02-9988-7766",
    openingHours: "10:00–20:00",
    cuisineType: "義大利料理",
    priceRange: "$$",
    rating: 4,
    chefNationality: "義大利"
  },
  {
    name: "京宴燒肉",
    description: "高級日式燒肉",
    address: "台南市東區中華東路88號",
    phone: "06-8877-6655",
    openingHours: "17:00–23:00",
    cuisineType: "燒肉",
    priceRange: "$$$",
    rating: 5,
    chefNationality: "日本"
  },
  {
    name: "Pho 88",
    description: "越南河粉、清爽湯底",
    address: "台北市萬華區西寧南路10號",
    phone: "02-5555-7777",
    openingHours: "09:00–20:00",
    cuisineType: "越南料理",
    priceRange: "$",
    rating: 4,
    chefNationality: "越南"
  },
  {
    name: "酥皮炸雞王",
    description: "連鎖炸雞速食",
    address: "台中市北區進化路168號",
    phone: "04-8888-0000",
    openingHours: "10:00–22:00",
    cuisineType: "美式快餐",
    priceRange: "$",
    rating: 3,
    chefNationality: "美國"
  },
  {
    name: "Aroma Bistro",
    description: "異國創意小館",
    address: "台北市大安區光復南路180號",
    phone: "02-4444-2222",
    openingHours: "14:00–22:00",
    cuisineType: "法式料理",
    priceRange: "$$$",
    rating: 5,
    chefNationality: "法國"
  },
  {
    name: "龍涎居鵝肉",
    description: "台式鵝肉飯專賣",
    address: "新竹市北區勝利路45號",
    phone: "03-2222-1111",
    openingHours: "11:00–21:00",
    cuisineType: "台灣小吃",
    priceRange: "$",
    rating: 4,
    chefNationality: "台灣"
  },
  {
    name: "Chuan House",
    description: "川菜辣味十足",
    address: "台北市信義區松壽路20號",
    phone: "02-3333-6666",
    openingHours: "12:00–22:30",
    cuisineType: "川菜",
    priceRange: "$$",
    rating: 5,
    chefNationality: "中國"
  }
];

// 🚀 主程式：批次插入資料
async function run() {
  try {
    await db.insert(restaurant).values(restaurantData);
    console.log('✅ 成功插入 10 筆餐廳資料！');
  } catch (err) {
    console.error('❌ 插入失敗：', err);
  }
}

run();
