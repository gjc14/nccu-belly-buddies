import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { restaurant } from './restaurant'

export const comment = pgTable('comment', {
  id: uuid('comment_id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurant.id),
  content: text('content').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
})
