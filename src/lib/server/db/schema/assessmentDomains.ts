import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from './db-utils';
import assessmentSubDomains from './assessmentSubDomains';
import { ulid } from 'ulid';

const assessmentDomains = pgTable('assessment_domains', {
	id: varchar({ length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	...timestamps
});

export const assessmentDomainsRelations = relations(assessmentDomains, ({ one, many }) => ({
	subDomain: many(assessmentSubDomains)
}));

export default assessmentDomains;
