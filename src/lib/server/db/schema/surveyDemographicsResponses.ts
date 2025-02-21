import { integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import schools from './schools';
import surveys from './surveys';
import { relations } from 'drizzle-orm';

const surveyDemographics = pgTable(
	'survey_demographics_responses',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		subjectTaught: varchar('subject_taught', { length: 256 }),
		yearsTeaching: integer('years_teaching'),
		schoolId: integer('school_id')
			.references(() => schools.id)
			.notNull(),
		surveyId: integer('survey_id')
			.references(() => surveys.id)
			.notNull(),
		...timestamps
	},
	(table) => [uniqueIndex('surveyId_schoolId_idx').on(table.surveyId, table.schoolId)]
);

export const surveyDemographicsRelations = relations(surveyDemographics, ({ one }) => ({
	school: one(schools, {
		fields: [surveyDemographics.schoolId],
		references: [schools.id]
	}),
	survey: one(surveys, {
		fields: [surveyDemographics.surveyId],
		references: [surveys.id]
	})
}));

export default surveyDemographics;
