import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq, and, isNotNull } from 'drizzle-orm';
import * as auth from '$lib/server/auth';

import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { registerExistingUserFromInviteSchema } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';
import { setFlash } from 'sveltekit-flash-message/server';
import {
	checkRegisteredUserExists,
	getAndSetAdminInviteUsedById,
	getUnusedAdminInviteById,
	updateAdminInviteWithInviteeAndMarkUsed,
	updateUserWithPassword
} from '$lib/server/queries';
import db from '$lib/server/db';
import { handleLogFlashReturnFormError } from '$lib/utils';

export const load: PageServerLoad = async ({ url }) => {
	const adminInviteId = url.searchParams.get('adminInviteId') || '';

	const form = await superValidate(zod(registerExistingUserFromInviteSchema));

	return { form, adminInvite: await getUnusedAdminInviteById({ inviteId: adminInviteId }) };
};

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event, zod(registerExistingUserFromInviteSchema));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid form' }, event.cookies);
			return message(form, { text: 'Invalid form', status: 'error' });
		}

		let registeredExistingUserId: string;

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userEmail = form.data.email;
		console.log('form.data.adminInviteId => ', form.data.adminInviteId);
		// throw new Error('testing...');
		if (!form.data.adminInviteId || form.data.adminInviteId.length != 26) {
			handleLogFlashReturnFormError({
				form,
				event,
				message: 'Invalid invite, please contact your administrator',
				status: 400,
				type: 'error'
			});
		}

		const existingUnusedInvite = await getUnusedAdminInviteById({
			inviteId: form.data.adminInviteId
		});

		if (!existingUnusedInvite) {
			handleLogFlashReturnFormError({
				form,
				event,
				message: 'Invalid invite, please contact your administrator',
				status: 400,
				type: 'error'
			});
		}

		const existingUser = await checkRegisteredUserExists({ username: userEmail });

		if (existingUser) {
			console.log('HERE => ', userEmail);
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
			const result = await db.transaction(async (trx) => {
				const updatedUserWithPW = await updateUserWithPassword({ userEmail, passwordHash }, trx);

				if (!updatedUserWithPW) throw new Error('Failed to register user');

				const inviteRes = await updateAdminInviteWithInviteeAndMarkUsed(
					{
						userEmail,
						inviteeId: updatedUserWithPW.id
					},
					trx
				);

				if (!inviteRes) throw new Error('Invite update failed');
				// throw new Error('testing...');

				return { newUserId: updatedUserWithPW.id, schoolId: existingUnusedInvite.schoolId! };
			});

			registeredExistingUserId = result.newUserId;

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, String(registeredExistingUserId));
			if (!session.expiresAt) throw new Error('Session expiry not set');
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(
				form,
				{
					text: 'Unexpected error: ' + errorMessage,
					status: 'error'
				},
				{ status: 500 }
			);
		}

		setFlash({ type: 'success', message: 'Sucessfully Registered!' }, event.cookies);

		return redirect(302, '/');
	}
};
