import { pgTable, boolean, timestamp, pgEnum, integer, varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps, userRolesEnum } from './db-utils';
import schools from './schools';
import district from './districts';
import users from './users';
import { ulid } from 'ulid';

export const invitesEnum = pgEnum('invite_type', ['school', 'district']);

export const userInvitesTable = pgTable('user_invites', {
	id: varchar({ length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	name: varchar({ length: 256 }).notNull(),
	email: varchar({ length: 256 }).notNull(),
	isSent: boolean().default(false),
	invitee: varchar({ length: 26 }).references((): AnyPgColumn => users.id),
	inviter: varchar({ length: 26 }).references((): AnyPgColumn => users.id),
	expiration: timestamp({ mode: 'string' })
		.notNull()
		.default(sql`NOW() + INTERVAL '10 days'`),
	isUsed: boolean().default(false),
	role: userRolesEnum().default('school_admin'),
	inviteType: invitesEnum().default('school'),
	schoolId: varchar({ length: 26 }).references((): AnyPgColumn => schools.id),
	districtId: varchar({ length: 26 }).references((): AnyPgColumn => district.id),
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
