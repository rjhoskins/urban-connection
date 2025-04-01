import { relations } from 'drizzle-orm';
import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { assessmentStatusEnum, timestamps } from './db-utils';
import schools from './schools';
import users from './users';

const assessments = pgTable('assessments', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	recipientName: varchar('recipient_name', { length: 256 }).notNull(),
	recipientEmail: varchar('recipient_email', { length: 256 }).notNull().unique(),
	schoolId: integer('school_id').references(() => schools.id),
	sentBy: varchar('sent_by', { length: 256 }).references(() => users.id),
	status: assessmentStatusEnum('status').default('sent'),
	...timestamps
});

export const assessmentsRelations = relations(assessments, ({ one }) => ({
	sentBy: one(users, {
		fields: [assessments.sentBy],
		references: [users.id]
	})
}));

export default assessments;
