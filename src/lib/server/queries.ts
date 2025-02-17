import { eq, and, isNotNull, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { User } from '$lib/server/db/schema';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { PgTransaction } from 'drizzle-orm/pg-core';

export async function createNewUser(
	{
		userId,
		passwordHash,
		username
	}: {
		userId: string;
		passwordHash: string;
		username: string; // email-based username;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
) {
	let [newUserRes] = await db
		.insert(table.usersTable)
		.values({ id: userId, username, passwordHash })
		.returning({ id: table.usersTable.id });
	return newUserRes;
}

export async function findIfActiveUserExists({
	username
}: {
	username: string;
}): Promise<Pick<User, 'id' | 'username' | 'passwordHash'> | null> {
	const results = await db
		.select({
			id: table.usersTable.id,
			username: table.usersTable.username,
			passwordHash: table.usersTable.passwordHash
		})
		.from(table.usersTable)
		.where(and(eq(table.usersTable.username, username), eq(table.usersTable.isActive, true)));
	return results[0] ?? null;
}

export async function findUnusedInviteByInviteId({ inviteId }: { inviteId: string }) {
	const [existingUnusedInvite] = await db
		.select()
		.from(table.userInvitesTable)
		.where(and(eq(table.userInvitesTable.id, inviteId), eq(table.userInvitesTable.isUsed, false)));
	return existingUnusedInvite ?? null;
}
export async function findUnusedInviteByEmail({ userEmail }: { userEmail: string }) {
	const [existingUnusedInvite] = await db
		.select()
		.from(table.userInvitesTable)
		.where(
			and(eq(table.userInvitesTable.email, userEmail), eq(table.userInvitesTable.isUsed, false))
		);
	return existingUnusedInvite ?? null;
}

export async function checkRegisteredUserExists({
	userEmail
}: {
	userEmail: string;
}): Promise<boolean> {
	const results = await db
		.select()
		.from(table.usersTable)
		.where(
			and(
				eq(table.usersTable.username, userEmail),
				eq(table.usersTable.isActive, false),
				isNotNull(table.usersTable.passwordHash)
			)
		);
	return results.length > 0;
}

export async function updateUserWithPassword(
	{
		userEmail,
		passwordHash
	}: {
		userEmail: string;
		passwordHash: string;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
): Promise<{ id: string }> {
	const queryBuilder = trx ? trx.update(table.usersTable) : db.update(table.usersTable);
	const [updatedUser] = await queryBuilder
		.set({ isActive: true, passwordHash })
		.where(eq(table.usersTable.username, userEmail))
		.returning({ id: table.usersTable.id });
	return updatedUser;
}

export async function updateRegisterInviteWithInviteeAndMarkUsed(
	{
		userEmail,
		inviteeId
	}: {
		userEmail: string;
		inviteeId: string;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
): Promise<{
	id: string;
	inviteType: string;
	schoolId: number | null;
	districtId: number | null;
}> {
	const queryBuilder = trx ? trx.update(table.userInvitesTable) : db.update(table.userInvitesTable);
	const [inviteRes] = await queryBuilder
		.set({ isUsed: true, invitee: inviteeId })
		.where(eq(table.userInvitesTable.email, userEmail))
		.returning({
			id: table.userInvitesTable.id,
			inviteType: table.userInvitesTable.inviteType,
			schoolId: table.userInvitesTable.schoolId ?? null,
			districtId: table.userInvitesTable.districtId ?? null
		});
	return inviteRes;
}

export async function createDistrictAdmin(
	{
		userId,
		districtId
	}: {
		userId: string;
		districtId: number;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
) {
	const queryBuilder = trx
		? trx.insert(table.districtAdminsTable)
		: db.insert(table.districtAdminsTable);
	const [result] = await queryBuilder
		.values({ userId, districtId: parseInt(districtId) })
		.returning({ id: table.districtAdminsTable.id });
	return result;
}

export async function createSchoolAdmin(
	{
		userId,
		schoolId
	}: {
		userId: string;
		schoolId: number;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
) {
	const queryBuilder = trx
		? trx.insert(table.schoolAdminsTable)
		: db.insert(table.schoolAdminsTable);
	const [result] = await queryBuilder
		.values({ userId, schoolId: parseInt(schoolId) })
		.returning({ id: table.schoolAdminsTable.id });
	return result;
}

export async function createSchool(
	{
		name,
		districtId,
		createdBy
	}: {
		name: string;
		districtId: number;
		createdBy: string;
	},
	trx?: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
): Promise<{ id: number }> {
	const queryBuilder = trx ? trx.insert(table.schoolsTable) : db.insert(table.schoolsTable);
	const [result] = await queryBuilder
		.values({ name, districtId, createdBy })
		.returning({ id: table.schoolsTable.id });
	return result;
}
