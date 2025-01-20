import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Constants
const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = 'auth-session';

// Helper function to get ISO timestamp
function getISOTimestamp(offsetDays: number = 0): string {
	return new Date(Date.now() + DAY_IN_MS * offsetDays).toISOString();
}

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	// console.log('createSession token, userId => ', token, userId);
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: getISOTimestamp(30)
	};
	await db.insert(table.sessionsTable).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: {
				id: table.usersTable.id,
				username: table.usersTable.username,
				name: table.usersTable.name,
				role: table.usersTable.role
			},
			session: table.sessionsTable
		})
		.from(table.sessionsTable)
		.innerJoin(table.usersTable, eq(table.sessionsTable.userId, table.usersTable.id))
		.where(eq(table.sessionsTable.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}

	const { session, user } = result;
	const currentTime = new Date().toISOString();

	// Check if session has expired
	if (currentTime >= session.expiresAt) {
		await db.delete(table.sessionsTable).where(eq(table.sessionsTable.id, session.id));
		return { session: null, user: null };
	}

	// Calculate renewal threshold (15 days before expiration)
	const renewalThreshold = new Date(Date.parse(session.expiresAt) - DAY_IN_MS * 15).toISOString();

	// Check if session needs renewal
	if (currentTime >= renewalThreshold) {
		const newExpiresAt = getISOTimestamp(30);
		session.expiresAt = newExpiresAt;
		await db
			.update(table.sessionsTable)
			.set({ expiresAt: newExpiresAt })
			.where(eq(table.sessionsTable.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.sessionsTable).where(eq(table.sessionsTable.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: string) {
	event.cookies.set(sessionCookieName, token, {
		expires: new Date(expiresAt),
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
