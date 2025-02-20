import { pgTable, varchar, boolean, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import userInvites from './adminUserInvites';
import { timestamps, userRolesEnum } from './db-utils';
import schoolAdmins from './schoolAdmins';

const users = pgTable(
	'users',
	{
		id: varchar('id', { length: 256 }).primaryKey().notNull(),
		name: varchar('name', { length: 256 }),
		phone: varchar('phone', { length: 256 }),
		username: varchar('username', { length: 256 }).notNull().unique(),
		passwordHash: varchar('password_hash').default(sql`NULL`),
		role: userRolesEnum('role').default('school_admin'),
		isActive: boolean('is_active').default(false),
		...timestamps
	},
	(table) => [index('username_idx').on(table.username)]
);

export const usersRelations = relations(users, ({ one, many }) => ({
	sentInvites: many(userInvites, {
		relationName: 'inviterRelation'
	}),
	receivedInvites: many(userInvites, {
		relationName: 'inviteeRelation'
	}),
	schoolAdmins: one(schoolAdmins, {
		fields: [users.id],
		references: [schoolAdmins.userId]
	})
}));
export default users;
