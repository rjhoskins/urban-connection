import { pgTable, varchar, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentDomains from './assessmentDomains';
import assessmentQuestions from './assessmentQuestions';

const assessmentSubDomains = pgTable('assessment_sub_domains', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull().unique(),
	description: varchar('description').notNull(),
	// videoData: jsonb('video_data').notNull(),
	domainId: integer('domain_id')
		.notNull()
		.references(() => assessmentDomains.id),
	...timestamps
});

export const assessmentSubDomainsRelations = relations(assessmentSubDomains, ({ one }) => ({
	domain: one(assessmentDomains, {
		fields: [assessmentSubDomains.domainId],
		references: [assessmentDomains.id]
	}),
	assessmentQuestions: one(assessmentQuestions, {
		fields: [assessmentSubDomains.id],
		references: [assessmentQuestions.subDomainId]
	})
}));

export default assessmentSubDomains;
