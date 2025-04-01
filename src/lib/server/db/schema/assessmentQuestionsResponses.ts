import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, smallint, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import assessmentQuestions from './assessmentQuestions';
import assessments from './assessments';

const assessmentQuestionsResponses = pgTable(
	'assessment_questions_responses',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		assessmentId: integer('assessment_id')
			.notNull()
			.references(() => assessments.id),
		questionId: integer('question_id')
			.notNull()
			.references(() => assessmentQuestions.id),
		isValidSubdomainGroup: boolean('is_valid_subdomain_group').default(false),
		response: smallint('response').default(null!),
		...timestamps
	},
	(table) => [uniqueIndex('assessmentId_qId_idx').on(table.assessmentId, table.questionId)]
);

export const assessmentQuestionsResponsesRelations = relations(
	assessmentQuestionsResponses,
	({ one }) => ({
		assessment: one(assessments, {
			fields: [assessmentQuestionsResponses.assessmentId],
			references: [assessments.id]
		}),
		question: one(assessmentQuestions, {
			fields: [assessmentQuestionsResponses.questionId],
			references: [assessmentQuestions.id]
		})
	})
);

export default assessmentQuestionsResponses;
