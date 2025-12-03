import { pgTable, varchar, integer, boolean, timestamp, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps, userRolesEnum } from './db-utils';

import { invitesEnum } from './userInvites';
import users from './users';
import schools from './schools';
import districts from './districts';
import { ulid } from 'ulid';

const adminUserInvites = pgTable(
	'admin_user_invites',
	{
		id: varchar({ length: 26 })
			.$defaultFn(() => ulid())
			.primaryKey(),
		name: varchar({ length: 256 }).notNull(), // from the invite form
		email: varchar().notNull(),
		isSent: boolean('is_sent').default(false),
		invitee: varchar({ length: 26 }).references((): AnyPgColumn => users.id), // user who received the invite (if they sign up, this is their id)
		inviter: varchar({ length: 26 }).references((): AnyPgColumn => users.id),
		expiration: timestamp({ mode: 'string' })
			.notNull()
			.default(sql`NOW() + INTERVAL '10 days'`),
		isUsed: boolean().default(false).notNull(),
		role: userRolesEnum().default('school_admin'),
		inviteType: invitesEnum().default('school'),
		schoolId: varchar({ length: 26 }).references((): AnyPgColumn => schools.id),
		districtId: varchar({ length: 26 }).references((): AnyPgColumn => districts.id),

		...timestamps
	},
	(table) => [
		{
			checkConstraint: check(
				'check_invite_has_school_or_district',
				sql`(${table.inviteType} = 'school' AND ${table.schoolId} IS NOT NULL AND ${table.districtId} IS NULL) OR 
		  (${table.inviteType} = 'district' AND ${table.districtId} IS NOT NULL AND ${table.schoolId} IS NULL)`
			)
		}
	]
);

export const adminUserInvitesRelations = relations(adminUserInvites, ({ one }) => ({
	inviter: one(users, {
		fields: [adminUserInvites.inviter],
		references: [users.id],
		relationName: 'inviterRelation'
	}),
	invitee: one(users, {
		fields: [adminUserInvites.invitee],
		references: [users.id],
		relationName: 'inviteeRelation'
	})
}));

export default adminUserInvites;
