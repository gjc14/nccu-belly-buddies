import { pgTable, uuid, text, integer, timestamp} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { restaurant } from './restaurant'

export const group = pgTable('group', {
    id: uuid('group_id').defaultRandom().primaryKey(),
    name: text('group_name').notNull(),
    description: text('description'),
    creatorId: text('creator_id').notNull().references(() => user.id),
    restaurantID: text('restaurant_id').references(() => restaurant.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    status: text('status').notNull().default('active'),
    proposedBudget: text('proposed_budget'),
    foodPreference: text('food_preference'),
    numofPeople: integer('num_of_people'),
    startTime: timestamp('start_time'),
    spokenLanguage: text('spoken_language'),
})

export const groupMember = pgTable('group_member', {
    groupId:text('group_id').notNull().references(() => group.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
}, (table) => ({
    primaryKey: [table.groupId, table.userId],
}));

