import { createNewUserFromInviteSchema } from '$lib/schema';
import * as auth from '$lib/server/auth';
import { hash } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '../$types';

import { setFlash } from 'sveltekit-flash-message/server';
import {
	createDistrictAdmin,
	createSchoolAdmin,
	findUnusedInviteByEmail,
	updateRegisterInviteWithInviteeAndMarkUsed
} from '$lib/server/queries';

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event, zod(createNewUserFromInviteSchema));
		if (!form.valid) {
			return message(form, {
				text: 'Invalid form',
				status: 'error'
			});
		}

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userEmail = form.data.email;

		const existingUnusedInvite = await findUnusedInviteByEmail({ userEmail });

		if (!existingUnusedInvite) {
			return message(form, {
				text: 'Invalid invite, please contact your administrator',
				status: 'error'
			});
		}
		console.log('existingUnusedInvite => ', existingUnusedInvite);

		try {
			const result = await db.transaction(async (trx) => {
				// const [newUser] = await trx
				// 	.insert(table.usersTable)
				// 	.values({ id: newUserId, username: userEmail, passwordHash, name: form.data.name })
				// 	.returning({ id: table.usersTable.id });
				const reqisteredUser = {};

				if (!reqisteredUser) throw new Error('Failed to create user');

				const inviteRes = await updateRegisterInviteWithInviteeAndMarkUsed(
					{ userEmail, inviteeId: reqisteredUser.id },
					trx
				);

				if (!inviteRes) throw new Error('Invite update failed');

				//associate user with school/district
				if (inviteRes.inviteType === 'school') {
					await createSchoolAdmin({ userId: newUser.id, schoolId: inviteRes.schoolId! });
				} else if (inviteRes.inviteType === 'district') {
					await createDistrictAdmin({ userId: newUser.id, districtId: inviteRes.districtId! });
				}

				return newUser;
			});

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, { text: 'Unexpected error: ' + errorMessage }, { status: 500 });
		}

		return redirect(302, '/');
	}
};
