import { relations } from 'drizzle-orm';
import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { assessmentStatusEnum, timestamps } from './db-utils';
import schools from './schools';
import users from './users';
import assessmentInvites from './assessmentInvites';
import { ulid } from 'ulid';

const assessments = pgTable('assessments', {
	id: varchar({ length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	schoolId: varchar({ length: 26 }).references(() => schools.id),
	createdBy: varchar({ length: 26 }).references(() => users.id),
	assessmentInviteId: varchar({ length: 26 }).references(() => assessmentInvites.id),
	participantName: varchar({ length: 256 }).notNull(),
	participantEmail: varchar({ length: 256 }).notNull().unique(),
	status: assessmentStatusEnum().default('started').notNull(), // default now started to reflect first visit
	...timestamps
});

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
	school: one(schools, { fields: [assessments.schoolId], references: [schools.id] }),
	createdByUser: one(users, { fields: [assessments.createdBy], references: [users.id] }),
	assessmentInvite: one(assessmentInvites, {
		fields: [assessments.assessmentInviteId],
		references: [assessmentInvites.id]
	})
}));

export default assessments;
