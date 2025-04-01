import { integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import schools from './schools';
import assessments from './assessments';
import { relations } from 'drizzle-orm';

const assessmentDemographics = pgTable(
	'assessment_demographics_responses',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		subjectTaught: varchar('subject_taught', { length: 256 }),
		yearsTeaching: integer('years_teaching'),
		schoolId: integer('school_id')
			.references(() => schools.id)
			.notNull(),
		assessmentId: integer('assessment_id')
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
