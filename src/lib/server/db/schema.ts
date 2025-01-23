import { is, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { check, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['super_admin', 'district_admin', 'school_admin']);
export const invitesEnum = pgEnum('invite_type', ['school', 'district']);

export const usersTable = pgTable(
	'users',
	{
		id: text('id').primaryKey().notNull(),
		// age: integer('age'),
		name: text('name'), // user supplied name
		username: text('username').notNull().unique(), // email-based username
		passwordHash: text('password_hash'),
		// email: varchar('email').notNull().unique(),
		role: rolesEnum('role').default('school_admin'),
		isActive: boolean('is_active').default(false),
		createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
	},
	(table) => [
		{
			checkConstraint: check(
				'has_password_check',
				sql`(${table.isActive} = true AND ${table.passwordHash} IS NOT NULL)`
			)
		}
	]
);

export const sessionsTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull()
});

export const schoolsTable = pgTable('schools', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull(),
	districtID: integer('district_id')
		.references((): AnyPgColumn => districtsTable.id)
		.notNull(),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	createdBy: text('created_by').references((): AnyPgColumn => usersTable.id)
});

export const assessmentInvitesTable = pgTable('assessment_invites', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	schoolId: integer('school_id')
		.notNull()
		.references(() => schoolsTable.id),
	email: varchar('email').notNull(),
	inviteText: text('invite_text'),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	createdBy: text('created_by').references((): AnyPgColumn => usersTable.id)
});

export const schoolAssessmentsTable = pgTable('school_assessments', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	schoolId: integer('school_id')
		.notNull()
		.references(() => schoolsTable.id),
	assessmentInviteId: integer('assessment_invite_id')
		.notNull()
		.references(() => assessmentInvitesTable.id),
	isCompleted: boolean('is_completed').default(false),
	completedAt: timestamp('completed_at', { mode: 'string' }),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const schoolAdminsTable = pgTable('school_admins', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id)
		.unique(), // one school per admin
	schoolId: integer('school_id')
		.notNull()
		.references(() => schoolsTable.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const districtsTable = pgTable('districts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name').notNull(),
	isActive: boolean('is_active').default(true),

	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const districtAdminsTable = pgTable('district_admins', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id)
		.unique(), // Ensures one school per admin
	districtId: integer('school_id')
		.notNull()
		.references(() => districtsTable.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const userInvitesTable = pgTable(
	'user_invites',
	{
		id: text('id').primaryKey(),
		name: varchar('name').notNull(), // from the invite form
		email: varchar('email').notNull(),
		isSent: boolean('is_sent').default(false),

		invitee: text('invitee').references((): AnyPgColumn => usersTable.id), // user who received the invite (if they sign up, this is their id)
		inviter: text('inviter').references((): AnyPgColumn => usersTable.id),
		//	.notNull(), // user who created the invite
		expiration: timestamp('expiration', { mode: 'string' })
			.notNull()
			.default(sql`NOW() + INTERVAL '72 hours'`),
		isUsed: boolean('is_used').default(false),
		role: rolesEnum('role').default('school_admin'),

		inviteType: invitesEnum('invite_type').default('school'),
		schoolId: integer('school_id').references((): AnyPgColumn => schoolsTable.id),
		districtId: integer('district_id').references((): AnyPgColumn => districtsTable.id),
		inviteText: text('invite_text'),

		createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
	},
	(table) => [
		{
			checkConstraint: check(
				'check_invite_scope',
				sql`(${table.inviteType} = 'school' AND ${table.schoolId} IS NOT NULL AND ${table.districtId} IS NULL) OR 
		  (${table.inviteType} = 'district' AND ${table.districtId} IS NOT NULL AND ${table.schoolId} IS NULL)`
			)
		}
	]
);
export type Session = typeof sessionsTable.$inferSelect;

export type User = typeof usersTable.$inferSelect;
