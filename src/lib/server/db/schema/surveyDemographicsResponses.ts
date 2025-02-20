import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import schools from './schools';
import surveys from './surveys';
import { relations } from 'drizzle-orm';

const surveyDemographics = pgTable('survey_demographics_responses', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	subjectTaught: varchar('subject_taught', { length: 256 }).notNull(),
	yearsTeaching: integer('years_teaching').notNull(),
	schoolId: integer('school_id').references(() => schools.id),
	surveyId: integer('survey_id').references(() => surveys.id),
	...timestamps
});

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
