import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import surveyQuestions from './surveyQuestions';
import surveys from './surveys';

const surveyQuestionsResponses = pgTable('survey_questions_responses', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	surveyId: integer('survey_id')
		.notNull()
		.references(() => surveys.id),
	questionId: integer('question_id')
		.notNull()
		.references(() => surveyQuestions.id),
	response: boolean('response').notNull(),
	...timestamps
});

export const surveyQuestionsResponsesRelations = relations(surveyQuestionsResponses, ({ many }) => ({
	question: many(surveyQuestions)
}));

export default surveyQuestionsResponses;
