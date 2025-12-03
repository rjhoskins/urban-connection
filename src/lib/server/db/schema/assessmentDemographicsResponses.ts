import { integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import schools from './schools';
import assessments from './assessments';
import { relations } from 'drizzle-orm';
import { ulid } from 'ulid';

const assessmentDemographics = pgTable(
	'assessment_demographics_responses',
	{
		id: varchar({ length: 26 })
			.$defaultFn(() => ulid())
			.primaryKey(),
		educationLevel: varchar({ length: 64 }),
		yearsTeaching: integer(),
		schoolId: varchar({ length: 26 })
			.references(() => schools.id)
			.notNull(),
		assessmentId: varchar({ length: 26 })
			.references(() => assessments.id)
			.notNull(),
		...timestamps
	},
	(table) => [uniqueIndex('assessmentId_schoolId_idx').on(table.assessmentId, table.schoolId)]
);

export const assessmentDemographicsRelations = relations(assessmentDemographics, ({ one }) => ({
	school: one(schools, {
		fields: [assessmentDemographics.schoolId],
		references: [schools.id]
	}),
	assessment: one(assessments, {
		fields: [assessmentDemographics.assessmentId],
		references: [assessments.id]
	})
}));

export default assessmentDemographics;
