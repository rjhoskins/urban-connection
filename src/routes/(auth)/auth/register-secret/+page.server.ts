import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';

import * as auth from '$lib/server/auth';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserFromInviteSchema } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { checkRegisteredUserExists, simpleRegisterToBeDEPRICATED } from '$lib/server/queries';
import { dev } from '$app/environment';
import { generateUserId } from '$lib/utils';

export const load: PageServerLoad = async ({ url }) => {
	if (!dev) return redirect(302, '/');
	const token = url.searchParams.get('inviteToken');

	const form = await superValidate(zod(createNewUserFromInviteSchema));

	return { form, token };
};

export const actions: Actions = {
	register: async (event) => {
		if (!dev) return redirect(302, '/');
		const form = await superValidate(event, zod(createNewUserFromInviteSchema));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid form' }, event.cookies);
			return message(form, 'Invalid form');
		}

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userEmail = form.data.email;
		console.log('HERE form => ', form);

		const existingUser = await checkRegisteredUserExists({ username: userEmail });
		console.log('HERE => ', userEmail);
		if (existingUser) {
			console.log('HERE => ', userEmail);
			setFlash(
				{ type: 'error', message: 'User already exists, please contact your administrator' },
				event.cookies
			);
			return message(form, 'User already exists, please contact your administrator');
		}

		try {
			const newUser = await simpleRegisterToBeDEPRICATED({
				id: generateUserId(),
				username: userEmail,
				passwordHash
			});
			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, newUser.id);
			if (!session?.expiresAt) throw new Error('Session creation failed');
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
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
