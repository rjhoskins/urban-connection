import { pgTable, varchar, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentDomains from './assessmentDomains';
import assessmentQuestions from './assessmentQuestions';
import { ulid } from 'ulid';

const assessmentSubDomains = pgTable('assessment_sub_domains', {
	id: varchar({ length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	name: varchar().notNull().unique(),
	description: varchar().notNull(),
	// videoData: jsonb('video_data').notNull(),
	domainId: varchar({ length: 26 })
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
