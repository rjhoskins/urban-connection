import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import type { InsertSession } from './db/schema/sessions';

import { db } from './db';
import { sessions, users } from './db/schema';

// Constants
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const BROWSER_SESSION_DURATION_IN_DAYS = 15;

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
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: InsertSession = {
		id: sessionId,
		userId,
		expiresAt: getISOTimestamp(30)
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: {
				id: users.id,
				username: users.username,
				name: users.name,
				role: users.role
			},
			session: sessions
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}

	const { session, user } = result;
	const currentTime = new Date().toISOString();

	// Check if session has expired
	if (currentTime >= session.expiresAt) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	// Calculate renewal threshold (15 days before expiration)
	const renewalThreshold = new Date(
		Date.parse(session.expiresAt) - DAY_IN_MS * BROWSER_SESSION_DURATION_IN_DAYS
	).toISOString();

	// Check if session needs renewal
	if (currentTime >= renewalThreshold) {
		const newExpiresAt = getISOTimestamp(30);
		session.expiresAt = newExpiresAt;
		await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: string) {
	event.cookies.set(sessionCookieName, token, {
		expires: new Date(expiresAt),
		httpOnly: true,
		// secure: true,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
