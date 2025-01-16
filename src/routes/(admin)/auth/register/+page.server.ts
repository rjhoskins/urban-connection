import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserFromInviteSchema } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');

	const form = await superValidate(zod(createNewUserFromInviteSchema));

	return { form, token };
};

export const actions: Actions = {
	register: async (event) => {
		console.log('register event => ');
		const form = await superValidate(event, zod(createNewUserFromInviteSchema));
		let newUserId = generateUserId();
		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		}); // gotta

		if (!form.valid) {
			// return fail(400, { form });
			return message(form, 'Invalid form'); // Will return fail(400, { form }) since form isn't valid
		}

		try {
			await db.transaction(async (trx) => {
				// user already exists?
				const [existingUser] = await db
					.select()
					.from(table.usersTable)
					.where(eq(table.usersTable.username, form.data.email));

				if (existingUser) {
					return message(form, 'User already exists, please contact your administrator');
				}

				// update invite - all invites should be marked as used
				const [inviteRes] = await trx
					.update(table.userInvitesTable)
					.set({ used: true, invitee: newUserId })
					.where(eq(table.userInvitesTable.email, form.data.email))
					.returning();

				if (!inviteRes) {
					trx.rollback();
					return message(form, 'Check your info and try again.', { status: 400 });
				}
				//
				const [userRes] = await trx
					.insert(table.usersTable)
					.values({
						id: newUserId,
						username: form.data.email,
						passwordHash,
						name: form.data.name
					})
					.returning();

				if (!userRes) {
					trx.rollback();
					return message(form, 'unable to register you, please contact your administrator', {
						status: 400
					});
				}
			});

			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ => ');
			// all good - cookie time nom nom
			const sessionToken = auth.generateSessionToken();
			console.log('sessionToken => ', sessionToken);

			const session = await auth.createSession(sessionToken, newUserId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			// return redirect(302, '/');
		} catch (error) {
			return message(form, 'unexpected error registering user: ' + error.message, {
				status: 500
			});
		}
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
