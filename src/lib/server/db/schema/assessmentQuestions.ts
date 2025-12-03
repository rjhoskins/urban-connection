import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentSubDomains from './assessmentSubDomains';
import { ulid } from 'ulid';

const assessmentQuestions = pgTable('assessment_questions', {
	id: varchar()
		.$defaultFn(() => ulid())
		.primaryKey(),
	text: varchar().notNull().unique(),
	subDomainId: varchar({ length: 26 })
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
