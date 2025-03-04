import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	// console.log('middleware event');
	// console.log('middleware event', event);
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
const checkPathUnathorizedUser: Handle = async ({ event, resolve }) => {
	//TODO: Implement this MAYBE TBD - TEST TEST TEST
	// console.log('middleware event');

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, checkPathUnathorizedUser);
