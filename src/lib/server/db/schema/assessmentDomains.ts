import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentSubDomains from './assessmentSubDomains';

const assessmentDomains = pgTable('assessment_domains', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	youtubeId: varchar('youtube_id', { length: 11 }), // YT IDs are 11 chars
	...timestamps
});

export const assessmentDomainsRelations = relations(assessmentDomains, ({ one, many }) => ({
	subDomain: many(assessmentSubDomains)
}));

export default assessmentDomains;
