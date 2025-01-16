import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserOrLoginSchema } from '$lib/schema';
import { SERVER_ERROR_MESSAGES } from '$lib/constants';

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
			return message(form, SERVER_ERROR_MESSAGES[400]); // Will return fail(400, { form }) since form isn't valid
		}

		const results = await db
			.select()
			.from(table.usersTable)
			.where(eq(table.usersTable.username, form.data.username));

		const existingUser = results.at(0);
		if (!existingUser) {
			console.log('user not found');
			return message(form, 'invalid username or password', {
				status: 404
			});
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			console.log('invalid password');
			return message(form, 'invalid username or password', {
				status: 404
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
			return message(form, 'Invalid form');
		}

		console.log('here => ');
		try {
			console.log('trying here => ');
			const userId = generateUserId();
			const passwordHash = await hash(form.data.password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			let newUserRes = await db
				.insert(table.usersTable)
				.values({ id: userId, username: form.data.username, passwordHash })
				.returning();

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return message(form, 'A user with this email address already exists.', {
				status: 409
			});
		} finally {
		}

		return redirect(302, '/auth/login');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
