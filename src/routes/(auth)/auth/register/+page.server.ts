import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq, and, isNotNull } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import * as table from '$lib/server/db/schema/db-utils';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserFromInviteSchema } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';
import { setFlash } from 'sveltekit-flash-message/server';
import {
	checkRegisteredUserExists,
	findUnusedInviteByInviteId,
	updateRegisterInviteWithInviteeAndMarkUsed,
	updateUserWithPassword
} from '$lib/server/queries';
import { set } from 'zod';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');

	const form = await superValidate(zod(createNewUserFromInviteSchema));

	return { form, token };
};

export const actions: Actions = {
	register: async (event) => {
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

		const existingUnusedInvite = await findUnusedInviteByInviteId({
			inviteId: form.data.inviteId as string
		});

		if (!existingUnusedInvite) {
			setFlash(
				{ type: 'error', message: 'Invalid invite, please contact your administrator' },
				event.cookies
			);
			return message(form, 'Invalid invite, please contact your administrator');
		}
		console.log('existingUnusedInvite => ', existingUnusedInvite);

		const existingUser = await checkRegisteredUserExists({ userEmail });
		if (existingUser) {
			setFlash(
				{ type: 'error', message: 'User already exists, please contact your administrator' },
				event.cookies
			);
			return message(form, 'User already exists, please contact your administrator');
		}

		try {
			const result = await db.transaction(async (trx) => {
				const updatedUserWithPW = await updateUserWithPassword({ userEmail, passwordHash }, trx);

				if (!updatedUserWithPW) throw new Error('Failed to register user');

				const inviteRes = await updateRegisterInviteWithInviteeAndMarkUsed(
					{
						userEmail,
						inviteeId: updatedUserWithPW.id
					},
					trx
				);

				if (!inviteRes) throw new Error('Invite update failed');

				return updatedUserWithPW;
			});

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		setFlash({ type: 'success', message: 'Sucessfully Registered!' }, event.cookies);

		return redirect(302, '/');
	}
};
