import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, smallint, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import assessmentQuestions from './assessmentQuestions';
import assessments from './assessments';
import { ulid } from 'ulid';

const assessmentQuestionsResponses = pgTable(
	'assessment_questions_responses',
	{
		id: varchar({ length: 26 })
			.$defaultFn(() => ulid())
			.primaryKey(),
		assessmentId: varchar({ length: 26 })
			.notNull()
			.references(() => assessments.id),
		questionId: varchar({ length: 26 })
			.notNull()
			.references(() => assessmentQuestions.id),
		isValidSubdomainGroup: boolean().default(false),
		response: smallint().default(null!),
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
