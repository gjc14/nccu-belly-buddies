import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { timestampAttributes } from './helpers'
import { restaurant } from './restaurant'

// ✅ 群組資料表
export const group = pgTable('group', {
  id: uuid('group_id').defaultRandom().primaryKey(),
  name: text('group_name').notNull(),
  description: text('description'),
  creatorId: text('creator_id').notNull().references(() => user.id),
  restaurantID: uuid('restaurant_id').references(() => restaurant.id, {
    onDelete: 'cascade',
  }),
  status: text('status').notNull().default('active'),
  proposedBudget: integer('proposed_budget'),
  foodPreference: text('food_preference'),
  numofPeople: integer('num_of_people'),
  startTime: timestamp('start_time'),
  ...timestampAttributes,
})

// ✅ 群組成員關聯表（不可刪）
export const groupMember = pgTable(
  'group_member',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => group.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    ...timestampAttributes,
  },
  table => [table.groupId, table.userId], // 複合主鍵
)
