import {
	boolean,
	integer,
	pgTable,
	timestamp,
	varchar,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import schools from './schools';
import users from './users';

const district = pgTable('districts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 256 }).notNull(),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 256 }).references((): AnyPgColumn => users.id)
});

export const districtsRelations = relations(district, ({ one, many }) => ({
	createdBy: one(users, {
		fields: [district.createdBy],
		references: [users.id]
	}),
	schools: many(schools)
}));

export default district;
