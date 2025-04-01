import { pgTable, boolean, timestamp, pgEnum, integer, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps, userRolesEnum } from './db-utils';
import schools from './schools';
import district from './districts';
import users from './users';

export const invitesEnum = pgEnum('invite_type', ['school', 'district']);

export const userInvitesTable = pgTable('user_invites', {
	id: varchar('id', { length: 256 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull(),
	isSent: boolean('is_sent').default(false),
	invitee: varchar('invitee', { length: 256 }).references((): AnyPgColumn => users.id),
	inviter: varchar('inviter', { length: 256 }).references((): AnyPgColumn => users.id),
	expiration: timestamp('expiration', { mode: 'string' })
		.notNull()
		.default(sql`NOW() + INTERVAL '10 days'`),
	isUsed: boolean('is_used').default(false),
	role: userRolesEnum('role').default('school_admin'),
	inviteType: invitesEnum('invite_type').default('school'),
	schoolId: integer('school_id').references((): AnyPgColumn => schools.id),
	districtId: integer('district_id').references((): AnyPgColumn => district.id),
	inviteText: varchar('invite_text', { length: 256 }),
	...timestamps
});

export const userInvitesRelations = relations(userInvitesTable, ({ one }) => ({
	inviter: one(users, {
		fields: [userInvitesTable.inviter],
		references: [users.id]
	}),
	invitee: one(users, {
		fields: [userInvitesTable.invitee],
		references: [users.id]
	})
}));
