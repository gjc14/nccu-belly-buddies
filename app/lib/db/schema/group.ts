import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { timestampAttributes } from './helpers'
import { restaurant } from './restaurant'

export const group = pgTable('group', {
	id: uuid('group_id').defaultRandom().primaryKey(),
	name: text('group_name').notNull(),
	description: text('description'),
	creatorId: text('creator_id')
		.notNull()
		.references(() => user.id),
	restaurantID: text('restaurant_id').references(() => restaurant.id, {
		onDelete: 'cascade',
	}),
	status: text('status').notNull().default('active'),
	proposedBudget: text('proposed_budget'),
	foodPreference: text('food_preference'),
	numofPeople: integer('num_of_people').notNull(),
	startTime: timestamp('start_time'),
	spokenLanguage: text('spoken_language'),

	...timestampAttributes,
})

export const groupMember = pgTable(
	'group_member',
	{
		groupId: text('group_id')
			.notNull()
			.references(() => group.id, { onDelete: 'cascade' }),
		groupName: text('group_name')
			.notNull()
			.references(() => group.name),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		userName: text('user_name')
			.notNull()
			.references(() => user.name),
		role: text('role').notNull().default('Member'),
		...timestampAttributes,
	},
	table => [table.groupId, table.userId],
)
