import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';

import * as auth from '$lib/server/auth';

import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserOrLoginSchema } from '$lib/schema';
import { SERVER_ERROR_MESSAGES } from '$lib/constants';
import { setFlash } from 'sveltekit-flash-message/server';
import { simpleRegisterToBeDEPRICATED, findIfActiveUserExists } from '$lib/server/queries';

import { handleLogFlashReturnFormError, handleTypeSafeError } from '$lib/utils';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	const form = await superValidate(zod(createNewUserOrLoginSchema));

	// Always return { form } in load functions (sveltekit-superforms)
	return { form };
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(createNewUserOrLoginSchema));

		if (!form.valid) {
			// return fail(400, { form });
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: SERVER_ERROR_MESSAGES[400],
				status: 404,
				event
			});
		}

		const existingUser = await findIfActiveUserExists({ username: form.data.username });

		if (!existingUser) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'invalid username, password, or user not found',
				status: 404,
				event
			});
		}

		const validPassword = await verify(existingUser.passwordHash!, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			console.log('ERROR here => ');
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'invalid username, password, or user not found',
				status: 404,
				event
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/auth/login');
	},
	register: async (event) => {
		const form = await superValidate(event, zod(createNewUserOrLoginSchema));
		console.log('register => ', form);

		if (!form.valid) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'invalid username, password, or user not found',
				status: 404,
				event
			});
		}

		try {
			const userId = generateUserId();
			const passwordHash = await hash(form.data.password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			let newUserRes = await simpleRegisterToBeDEPRICATED({
				id: userId,
				passwordHash,
				username: form.data.username
			});
			console.log('register newUserRes => ', newUserRes);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return handleTypeSafeError(e, 'A user with this email address already exists.', form);
		} finally {
		}
		setFlash({ type: 'success', message: 'Account created successfully!' }, event.cookies);
		return redirect(302, '/');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
