import { integer, pgTable, timestamp, varchar, type AnyPgColumn } from 'drizzle-orm/pg-core';
import schools from './schools';
import { relations } from 'drizzle-orm';
import users from './users';
import { timestamps } from './db-utils';
import { ulid } from 'ulid';
import assessments from './assessments';

const assessmentInvites = pgTable('assessment_invites', {
	id: varchar()
		.$defaultFn(() => ulid())
		.primaryKey(),
	schoolId: varchar({ length: 26 })
		.notNull()
		.references(() => schools.id),
	expiresAt: timestamp()
		.notNull()
		.$default(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // default to 7 days from creation
	createdBy: varchar().references((): AnyPgColumn => users.id),
	...timestamps
});

export const assessmentInvitesRelations = relations(assessmentInvites, ({ one, many }) => ({
	school: one(schools, {
		fields: [assessmentInvites.schoolId],
		references: [schools.id]
	}),
	invitee: one(users, {
		fields: [assessmentInvites.createdBy],
		references: [users.id]
	}),
	assessments: many(assessments)
}));

export default assessmentInvites;
