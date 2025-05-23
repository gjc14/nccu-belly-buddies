import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const restaurant = pgTable('restaurant', {
	id: uuid('res_id').defaultRandom().primaryKey(),
	name: text('res_name').notNull(),
	description: text('res_description'),
	address: text('address').notNull(),
	phone: text('phone'),
	openingHours: text('opening_hours'),
	cuisineType: text('cuisine_type'),
	priceRange: text('price_range'),
	rating: integer('rating'),
})
