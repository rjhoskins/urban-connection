import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import schools from './schools';
import { relations } from 'drizzle-orm';
import users from './users';
import { timestamps } from './db-utils';
import { ulid } from 'ulid';

const schoolAdmins = pgTable('school_admins', {
	id: varchar('id', { length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	userId: varchar('user_id', { length: 26 })
		.notNull()
		.references(() => users.id), //many is okay
	schoolId: varchar({ length: 26 })
		.notNull()
		.references(() => schools.id),
	...timestamps
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
