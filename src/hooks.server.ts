import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';

Sentry.init({
	dsn: 'https://954884e358eb9e223f8dea2e6c805092@o4508926805737472.ingest.us.sentry.io/4508926814846976',
	tracesSampleRate: 1
});

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
	//TODO: Implement this MAYBE TBD - TEST
	// console.log('middleware event');

	return resolve(event);
};

export const handle: Handle = sequence(
	Sentry.sentryHandle(),
	sequence(handleAuth, checkPathUnathorizedUser)
);
export const handleError = Sentry.handleErrorWithSentry();
