import exp from 'constants';
import { is, sql } from 'drizzle-orm';

import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
	interval,
	boolean
} from 'drizzle-orm/pg-core';
export const rolesEnum = pgEnum('roles', ['super_admin', 'district_admin', 'school_admin']);

export const usersTable = pgTable('users', {
	id: text('id').primaryKey(),
	age: integer('age'),
	name: varchar('name'), // user supplied name
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	// email: varchar('email').notNull().unique(),
	role: rolesEnum('role').default('school_admin')
});

export const sessionsTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const schoolsTable = pgTable('schools', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull(),
	districtID: integer('district_id')
		.references((): AnyPgColumn => districtsTable.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	isActive: boolean('is_active').default(true),
	createdBy: text('created_by').references((): AnyPgColumn => usersTable.id)
});

export const districtsTable = pgTable('districts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	name: varchar('name').notNull(),
	isActive: boolean('is_active').default(true)
});

export const userInvites = pgTable('user_invites', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull(), // from the invite form
	email: varchar('email').notNull(),
	invitee: text('invitee').references((): AnyPgColumn => usersTable.id), // user who received the invite (if they sign up, this is their id)
	inviter: text('inviter')
		.references((): AnyPgColumn => usersTable.id)
		.notNull(), // user who created the invite
	expiration: timestamp('expiration')
		.notNull()
		.default(sql`NOW() + INTERVAL '72 hours'`),
	used: integer('used').default(0),
	role: rolesEnum('role').default('school_admin'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
});
export type Session = typeof sessionsTable.$inferSelect;

export type User = typeof usersTable.$inferSelect;

// import exp from 'constants';
// import { sql } from 'drizzle-orm';
// import type { AnyPgColumn } from 'drizzle-orm/pg-core';
// import { pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
// import { pgTable, serial, varchar, text, integer, timestamp, interval } from 'drizzle-orm/pg-core';
// export const rolesEnum = pgEnum('roles', ['super_admin', 'district_admin', 'school_admin']);

// export const users = pgTable(
// 	'user',
// 	{
// 		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 		username: text('username').notNull().unique(),
// 		passwordHash: text('password_hash').notNull(),
// 		firstName: varchar('first_name', { length: 256 }),
// 		lastName: varchar('last_name', { length: 256 }),
// 		email: varchar('email').notNull().unique(),
// 		invitee: integer('invitee').references((): AnyPgColumn => users.id),
// 		role: rolesEnum('role').default('school_admin')
// 	},
// 	(table) => {
// 		return {
// 			emailIndex: uniqueIndex('email_idx').on(table.email)
// 		};
// 	}
// );
// export const userInvites = pgTable('user_invite', {
// 	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar('name').notNull(),
// 	email: varchar('email').notNull(),
// 	invitee: integer('invitee').references((): AnyPgColumn => users.id), // user who received the invite (if they sign up, this is their id)
// 	inviter: integer('inviter')
// 		.references((): AnyPgColumn => users.id)
// 		.notNull(), // user who created the invite
// 	expiration: timestamp('expiration')
// 		.notNull()
// 		.default(sql`NOW() + INTERVAL '72 hours'`),
// 	used: integer('used').default(0),
// 	role: rolesEnum('role').default('school_admin'),
// 	school: integer('school')
// 		.references((): AnyPgColumn => schools.id)
// 		.notNull(),
// 	district: integer('district')
// 		.references((): AnyPgColumn => districts.id)
// 		.notNull()
// });
// export const districts = pgTable('district', {
// 	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar('name').notNull()
// });
// export const schools = pgTable('school', {
// 	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar('name').notNull(),
// 	district: integer('district')
// 		.references((): AnyPgColumn => districts.id)
// 		.notNull()
// });
// export const admins = pgTable('admin', {
// 	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 	user: integer('user')
// 		.references((): AnyPgColumn => users.id)
// 		.notNull(),
// 	type: rolesEnum('role').notNull(),
// 	school: integer('school').references((): AnyPgColumn => schools.id), // Nullable, only for school admins
// 	district: integer('district').references((): AnyPgColumn => districts.id) // Nullable, only for district admins
// });

// export const sessions = pgTable('session', {
// 	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
// 	user: integer('user')
// 		.references((): AnyPgColumn => users.id)
// 		.notNull(),
// 	expiresAt: timestamp('expires_at')
// 		.notNull()
// 		.default(
// 			sql`CASE
//         WHEN "role" = 'school_admin' THEN CURRENT_TIMESTAMP + INTERVAL '7 days'
//         WHEN "role" = 'district_admin' THEN CURRENT_TIMESTAMP + INTERVAL '14 days'
//         ELSE CURRENT_TIMESTAMP + INTERVAL '7 days'
//       END`
// 		)
// });

// export type Session = typeof sessions.$inferSelect;

// export type User = typeof users.$inferSelect;
