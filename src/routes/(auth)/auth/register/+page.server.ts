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
	getLatestHtmlTemplateDataByType,
	updateRegisterInviteWithInviteeAndMarkUsed,
	updateSchoolAdminWithToken,
	updateUserWithPassword
} from '$lib/server/queries';
import { set } from 'zod';
import db from '$lib/server/db';
import { createAssessmentInviteToken, handleLogFlashReturnFormError } from '$lib/utils';

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

		let newUserId;

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userEmail = form.data.email;
		console.log('form.data.inviteId => ', form.data.inviteId);
		// throw new Error('testing...');

		const existingUnusedInvite = await findUnusedInviteByInviteId({
			inviteId: form.data.inviteId as string
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

				const inviteRes = await updateRegisterInviteWithInviteeAndMarkUsed(
					{
						userEmail,
						inviteeId: updatedUserWithPW.id
					},
					trx
				);

				// throw new Error('testing...');

				if (!inviteRes) throw new Error('Invite update failed');

				//handle assessment invite token
				const assessmentToken = createAssessmentInviteToken({
					sentBy: updatedUserWithPW.id,
					schoolId: existingUnusedInvite.schoolId!
				});
				await updateSchoolAdminWithToken(
					{ userId: updatedUserWithPW.id, token: assessmentToken },
					trx
				);
				if (!assessmentToken) throw new Error('Failed to create admin assessment token');

				return { newUserId: updatedUserWithPW.id, schoolId: existingUnusedInvite.schoolId! };
			});

			const assessmentInviteHtmlTemplate =
				await getLatestHtmlTemplateDataByType('assessment_invite');
			if (!assessmentInviteHtmlTemplate) {
				throw new Error('No assessment invite template found');
			}
			newUserId = result.newUserId;

			//send email with assessment link
			const assessmentToken = createAssessmentInviteToken({
				sentBy: result.newUserId,
				schoolId: result.schoolId
			});

			const inviteLink = `${event.url.origin}/urban-connection-project-assessment?assessmentToken=${assessmentToken}`;
			console.log(`inviteLink => , ${inviteLink}`);

			const res = await event.fetch('/api/send-assessment-invite', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					to: form.data.email,
					subject: 'Thank you for registering - Here is your assessment link',
					inviteLink,
					htmlEmailContent: assessmentInviteHtmlTemplate?.template
				})
			});
			if (!res.ok) {
				const errorMessage = await res.text();
				throw new Error(`Failed to send email: ${errorMessage}`);
			}

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, String(newUserId));
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
