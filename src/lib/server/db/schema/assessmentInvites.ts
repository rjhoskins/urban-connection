import { integer, pgTable, timestamp, varchar, type AnyPgColumn } from 'drizzle-orm/pg-core';
import schools from './schools';
import { relations } from 'drizzle-orm';
import users from './users';
import { timestamps } from './db-utils';

const assessmentInvites = pgTable('assessment_invites', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	schoolId: integer('school_id')
		.notNull()
		.references(() => schools.id),
	email: varchar('email', { length: 256 }).notNull(),
	createdBy: varchar('created_by', { length: 256 }).references((): AnyPgColumn => users.id),
	...timestamps
});

export const assessmentInvitesRelations = relations(assessmentInvites, ({ one }) => ({
	school: one(schools, {
		fields: [assessmentInvites.schoolId],
		references: [schools.id]
	}),
	invitee: one(users, {
		fields: [assessmentInvites.createdBy],
		references: [users.id]
	})
}));

export default assessmentInvites;
