import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';

import * as auth from '$lib/server/auth';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createsimpleRegisterToBeDEPRICATED } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { checkRegisteredUserExists, simpleRegisterToBeDEPRICATED } from '$lib/server/queries';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ url }) => {
	if (!dev) return redirect(302, '/');

	const form = await superValidate(zod(createsimpleRegisterToBeDEPRICATED));

	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		if (!dev) return redirect(302, '/');
		const form = await superValidate(event, zod(createsimpleRegisterToBeDEPRICATED));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid form' }, event.cookies);
			return message(form, { text: 'Invalid form', status: 'error' });
		}

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const username = form.data.username;
		console.log('HERE form => ', form);

		const existingUser = await checkRegisteredUserExists({ username });
		console.log('HERE => ', username);
		if (existingUser) {
			console.log('HERE => ', username);
			setFlash(
				{ type: 'error', message: 'User already exists, please contact your administrator' },
				event.cookies
			);
			return message(form, {
				text: 'User already exists, please contact your administrator',
				status: 'error'
			});
		}

		try {
			const newUser = await simpleRegisterToBeDEPRICATED({
				username,
				passwordHash
			});
			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			console.log('USER => ', newUser);
			const session = await auth.createSession(sessionToken, newUser.id);
			console.log('session CREATED okay => ', session);
			if (!session?.expiresAt) throw new Error('Session creation failed');
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			console.log('Session created and cookie set');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
			console.log('error => ', 'Unexpected error: ' + errorMessage);
		}

		setFlash({ type: 'success', message: 'Sucessfully Registered!' }, event.cookies);

		return redirect(302, '/');
	}
};
