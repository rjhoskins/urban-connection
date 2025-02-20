import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import surveyDomains from './surveyDomains';
import surveyQuestions from './surveyQuestions';

const surveySubDomains = pgTable('survey_sub_domains', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull().unique(),
	description: varchar('description').notNull(),
	domainId: integer('domain_id')
		.notNull()
		.references(() => surveyDomains.id),
	...timestamps
});

export const surveySubDomainsRelations = relations(surveySubDomains, ({ one }) => ({
	domain: one(surveyDomains, {
		fields: [surveySubDomains.domainId],
		references: [surveyDomains.id]
	}),
	surveyQuestions: one(surveyQuestions, {
		fields: [surveySubDomains.id],
		references: [surveyQuestions.subDomainId]
	})
}));

export default surveySubDomains;
