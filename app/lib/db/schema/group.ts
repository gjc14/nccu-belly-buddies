import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { timestampAttributes } from './helpers'
import { restaurant } from './restaurant'

export const group = pgTable('group', {
  id: uuid('group_id').defaultRandom().primaryKey(),
  name: text('group_name').notNull(),
  description: text('description'),
  creatorId: text('creator_id').notNull().references(() => user.id),

  restaurantID: uuid('restaurant_id').references(() => restaurant.id, {
    onDelete: 'cascade',
  }),

  status: text('status').notNull().default('active'),
  proposedBudget: integer('proposed_budget'), // 金額欄位建議用 integer 或 numeric
  foodPreference: text('food_preference'),
  numofPeople: integer('num_of_people'),
  startTime: timestamp('start_time'),

  // spokenLanguage: 移除

  ...timestampAttributes,
})

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
	table => [table.groupId, table.userId],
)
