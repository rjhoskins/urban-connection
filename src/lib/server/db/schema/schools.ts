import { pgTable, integer, boolean, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import districts from './districts';
import schoolAdmins from './schoolAdmins';
import assessmentInvites from './assessmentInvites';
import users from './users';

const schools = pgTable(
	'schools',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		name: varchar('name', { length: 256 }).notNull(),
		districtId: integer('district_id')
			.references((): AnyPgColumn => districts.id)
			.notNull(),
		createdBy: varchar('created_by', { length: 256 }).references((): AnyPgColumn => users.id),
		...timestamps
	},
	(table) => [uniqueIndex('districtSchoolNameComboUniqueIndex').on(table.districtId, table.name)]
);

export const schoolsRelations = relations(schools, ({ one, many }) => ({
	assessmentInvites: many(assessmentInvites),
	admins: many(schoolAdmins),
	district: one(districts, {
		fields: [schools.districtId],
		references: [districts.id]
	}),
	createdBy: one(users, {
		fields: [schools.createdBy],
		references: [users.id]
	})
}));

export default schools;
