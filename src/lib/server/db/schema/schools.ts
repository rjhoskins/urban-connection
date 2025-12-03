import { pgTable, integer, boolean, uniqueIndex, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import districts from './districts';
import schoolAdmins from './schoolAdmins';
import assessmentInvites from './assessmentInvites';
import users from './users';
import { ulid } from 'ulid';
import assessments from './assessments';
import { admin } from 'googleapis/build/src/apis/admin';

const schools = pgTable(
	'schools',
	{
		id: varchar({ length: 26 })
			.$defaultFn(() => ulid())
			.primaryKey(),
		districtId: varchar({ length: 26 })
			.references((): AnyPgColumn => districts.id)
			.notNull(),
		name: varchar({ length: 256 }).notNull(),
		createdBy: varchar({ length: 26 }).references((): AnyPgColumn => users.id),
		stripePaymentId: varchar({ length: 256 }),
		stripeData: jsonb(),
		...timestamps
	},
	(table) => [uniqueIndex('districtSchoolNameComboUniqueIndex').on(table.districtId, table.name)]
);

export const schoolsRelations = relations(schools, ({ one, many }) => ({
	district: one(districts, {
		fields: [schools.districtId],
		references: [districts.id]
	}),
	createdBy: one(users, {
		fields: [schools.createdBy],
		references: [users.id]
	}),
	assessmentInvites: many(assessmentInvites),
	admins: many(schoolAdmins),
	assessments: many(assessments)
}));

export default schools;
