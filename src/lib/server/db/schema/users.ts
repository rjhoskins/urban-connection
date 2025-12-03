import { pgTable, varchar, boolean, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import userInvites from './adminUserInvites';
import { timestamps, userRolesEnum } from './db-utils';
import schoolAdmins from './schoolAdmins';
import { ulid } from 'ulid';

const users = pgTable(
	'users',
	{
		id: varchar({ length: 26 })
			.$defaultFn(() => ulid())
			.primaryKey(),
		name: varchar({ length: 256 }),
		phone: varchar({ length: 256 }),
		username: varchar({ length: 256 }).notNull().unique(),
		passwordHash: varchar().default(sql`NULL`),
		role: userRolesEnum().default('school_admin'),
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
