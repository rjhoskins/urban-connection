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
import { timestamps } from './db-utils';

const district = pgTable('districts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 256 }).notNull(),
	createdBy: varchar('created_by', { length: 256 }).references((): AnyPgColumn => users.id),
	...timestamps
});

export const districtsRelations = relations(district, ({ one, many }) => ({
	createdBy: one(users, {
		fields: [district.createdBy],
		references: [users.id]
	}),
	schools: many(schools)
}));

export default district;
