import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import assessmentInvites from './assessmentInvites';
import schools from './schools';

const schoolAssessments = pgTable('school_assessments', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	schoolId: integer('school_id')
		.notNull()
		.references(() => schools.id),
	assessmentInviteId: integer('assessment_invite_id')
		.notNull()
		.references(() => assessmentInvites.id),
	isCompleted: boolean('is_completed').default(false),
	completedAt: timestamp('completed_at', { mode: 'string' }),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const schoolAssessmentsRelations = relations(schoolAssessments, ({ one }) => ({
	school: one(schools, {
		fields: [schoolAssessments.schoolId],
		references: [schools.id]
	}),
	assessmentInvite: one(assessmentInvites, {
		fields: [schoolAssessments.assessmentInviteId],
		references: [assessmentInvites.id]
	})
}));

export default schoolAssessments;
