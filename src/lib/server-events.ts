import { setFlash } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import {
	createAdminUserInvite,
	createNewUserWithDetails,
	createSchoolAdmin,
	findIfUserExistsById,
	getLatestHtmlTemplateDataByType,
	getSchoolDetailsById
} from './server/queries';
import { handleLogFlashReturnFormError } from './utils';
import { inviteNewCoAdminUserSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import db from './server/db';

export async function handleInviteCoAdminSubmitEvent(event: RequestEvent) {
	if (!event.locals.user) return redirect(302, '/auth/login');

	//testing
	// return { success: true, message: 'Invite sent successfully' };
	// error(400, 'Invite sent unsuccessfully');

	const form = await superValidate(event, zod(inviteNewCoAdminUserSchema));
	console.log('form data => ', form.data);

	if (!form.valid) {
		return handleLogFlashReturnFormError({
			type: 'error',
			form,
			message: 'Invalid form',
			status: 400,
			event
		});
	}
	const schoolId = event.params.schoolId;

	const existingUser = await findIfUserExistsById({ username: form.data.email as string });

	if (existingUser) {
		return handleLogFlashReturnFormError({
			type: 'error',
			form,
			message: 'User already exists, please contact your administrator',
			status: 400,
			event
		});
	}
	const schoolRes = await getSchoolDetailsById(schoolId as string);
	if (!schoolRes) {
		return handleLogFlashReturnFormError({
			type: 'error',
			form,
			message: 'School not found, cannot send invite',
			status: 400,
			event
		});
	}

	let htmlTemplate;

	try {
		htmlTemplate = await getLatestHtmlTemplateDataByType();
		if (!htmlTemplate) throw new Error('Failed to get html template data');
		const result = await db.transaction(
			async (trx: PgTransaction<PostgresJsQueryResultHKT, any, any> | undefined) => {
				const schoolRes = await getSchoolDetailsById(schoolId as string, trx);
				if (!schoolRes.id) throw new Error('School not found or does not exist');

				const newUser = await createNewUserWithDetails(
					{
						username: form.data.email,
						name: form.data.name,
						phone: form.data.phone || undefined
					},
					trx
				);
				if (!newUser) throw new Error('Failed to create user');

				let newAdminInvite = await createAdminUserInvite(
					{
						inviteData: {
							name: form.data.name,
							email: form.data.email,
							inviteType: 'school', //only school admins can be invited by other school admins
							inviter: event.locals.user?.id ?? '',
							schoolId: schoolRes.id ?? null,
							districtId: schoolRes.districtId ?? null
						}
					},
					trx
				);
				if (!newAdminInvite) throw new Error('Failed to create invite');

				//associate user with school/district
				let adminRes;

				adminRes = await createSchoolAdmin(
					{ userId: newUser.id, schoolId: newAdminInvite.schoolId! },
					trx
				);

				if (!adminRes) {
					throw new Error('Failed to associate admin');
				}

				console.log('inviteRes ALL THE STUFFS => ', {
					schoolRes,
					newUser,
					newAdminInvite,
					adminRes
				});
				// throw new Error('Testing transaction rollback');

				return { schoolRes, newUser, newAdminInvite, adminRes };
			}
		);

		if (!result) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'failed to invite user',
				status: 400,
				event
			});
		}

		const res = await event.fetch('/api/send-admin-email-invite', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				to: form.data.email,
				subject: 'You have been invited to join the platform',
				inviteLink: `${event.url.origin}/auth/register?adminInviteId=${result.newAdminInvite.id}`,
				htmlEmailContent: htmlTemplate.template
			})
		});
		if (!res.ok) {
			const errorMessage = await res.text();
			throw new Error(`Failed to send email: ${errorMessage}`);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
		const UnexpectedErrorMsg = 'Unexpected error: ' + errorMessage;
		return handleLogFlashReturnFormError({
			type: 'error',
			form,
			message: UnexpectedErrorMsg,
			status: 500,
			event
		});
	}
	return { success: true, message: 'Invite sent successfully' };
}
