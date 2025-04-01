import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentSubDomains from './assessmentSubDomains';

const assessmentQuestions = pgTable('assessment_questions', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	text: varchar('text', { length: 256 }).notNull().unique(),
	subDomainId: integer('sub_domain_id')
		.notNull()
		.references(() => assessmentSubDomains.id),
	...timestamps
});

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one }) => ({
	subDomain: one(assessmentSubDomains, {
		fields: [assessmentQuestions.subDomainId],
		references: [assessmentSubDomains.id]
	})
}));

export default assessmentQuestions;
