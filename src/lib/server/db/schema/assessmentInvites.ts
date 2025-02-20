import { integer, pgTable, timestamp, varchar, type AnyPgColumn } from 'drizzle-orm/pg-core';
import schools from './schools';
import { relations } from 'drizzle-orm';
import users from './users';

const assessmentInvites = pgTable('assessment_invites', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	schoolId: integer('school_id')
		.notNull()
		.references(() => schools.id),
	email: varchar('email', { length: 256 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 256 }).references((): AnyPgColumn => users.id)
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
