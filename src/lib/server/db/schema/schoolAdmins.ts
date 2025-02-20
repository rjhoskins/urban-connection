import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import schools from './schools';
import { relations } from 'drizzle-orm';
import users from './users';

const schoolAdmins = pgTable('school_admins', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar('user_id', { length: 256 })
		.notNull()
		.references(() => users.id), //many is okay
	schoolId: integer('school_id')
		.notNull()
		.references(() => schools.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const schoolAdminsRelations = relations(schoolAdmins, ({ one, many }) => ({
	user: one(users, {
		fields: [schoolAdmins.userId],
		references: [users.id]
	}),
	school: one(schools, {
		fields: [schoolAdmins.schoolId],
		references: [schools.id]
	})
}));

export default schoolAdmins;
