import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import surveySubDomains from './surveySubDomains';

const surveyQuestions = pgTable('survey_questions', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	text: varchar('text', { length: 256 }).notNull().unique(),
	subDomainId: integer('sub_domain_id')
		.notNull()
		.references(() => surveySubDomains.id),
	...timestamps
});

export const surveyQuestionsRelations = relations(surveyQuestions, ({ one }) => ({
	subDomain: one(surveySubDomains, {
		fields: [surveyQuestions.subDomainId],
		references: [surveySubDomains.id]
	})
}));

export default surveyQuestions;
