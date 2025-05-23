import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { restaurant } from './restaurant'

export const rating = pgTable('rating', {
  id: uuid('rating_id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurant.id),
  score: integer('score').notNull(), // 例如 1 ~ 5 分
})
