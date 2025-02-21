import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import surveyQuestions from './surveyQuestions';
import surveys from './surveys';

const surveyQuestionsResponses = pgTable(
	'survey_questions_responses',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		surveyId: integer('survey_id')
			.notNull()
			.references(() => surveys.id),
		questionId: integer('question_id')
			.notNull()
			.references(() => surveyQuestions.id),
		response: boolean('response').notNull(),
		...timestamps
	},
	(table) => [uniqueIndex('surveyId_qId_idx').on(table.surveyId, table.questionId)]
);

export const surveyQuestionsResponsesRelations = relations(surveyQuestionsResponses, ({ one }) => ({
	survey: one(surveys, {
		fields: [surveyQuestionsResponses.surveyId],
		references: [surveys.id]
	}),
	question: one(surveyQuestions, {
		fields: [surveyQuestionsResponses.questionId],
		references: [surveyQuestions.id]
	})
}));

export default surveyQuestionsResponses;
