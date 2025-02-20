import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import surveySubDomains from './surveySubDomains';

const surveyDomains = pgTable('survey_domains', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	...timestamps
});

export const surveyDomainsRelations = relations(surveyDomains, ({ one, many }) => ({
	subDomain: many(surveySubDomains)
}));

export default surveyDomains;
