import { pgTable, varchar, integer, boolean, timestamp, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps, userRolesEnum } from './db-utils';

import { invitesEnum } from './invites';
import users from './users';
import schools from './schools';
import districts from './districts';

const adminUserInvites = pgTable(
	'admin_user_invites',
	{
		id: varchar('id', { length: 256 }).primaryKey(),
		name: varchar('name', { length: 256 }).notNull(), // from the invite form
		email: varchar('email').notNull(),
		isSent: boolean('is_sent').default(false),

		invitee: varchar('invitee', { length: 256 }).references((): AnyPgColumn => users.id), // user who received the invite (if they sign up, this is their id)
		inviter: varchar('inviter', { length: 256 }).references((): AnyPgColumn => users.id),
		//	.notNull(), // user who created the invite
		expiration: timestamp('expiration', { mode: 'string' })
			.notNull()
			.default(sql`NOW() + INTERVAL '10 days'`),
		isUsed: boolean('is_used').default(false),

		role: userRolesEnum('role').default('school_admin'),
		inviteType: invitesEnum('invite_type').default('school'),
		schoolId: integer('school_id').references((): AnyPgColumn => schools.id),
		districtId: integer('district_id').references((): AnyPgColumn => districts.id),

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
