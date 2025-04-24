/** @type {import('./$types').PageServerLoad} */
/** @type {import('./$types').Actions} */
import { message, superValidate } from 'sveltekit-superforms/server';
import { inviteNewUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	createAdminUserInviteToken,
	generateUserId,
	handleLogFlashReturnFormError
} from '$lib/utils';

import { setFlash } from 'sveltekit-flash-message/server';
import db from '$lib/server/db/index.js';
import {
	createAdminUserInvite,
	createNewUserWithDetails,
	createSchoolAdmin,
	findIfUserExistsById,
	getLatestHtmlTemplateDataByType,
	getSchoolDetailsById
} from '$lib/server/queries.js';

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(inviteNewUserSchema));

	return { form, schoolAdminHtmlTemplate: await getLatestHtmlTemplateDataByType() };
};
export const actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');

		//testing
		// return { success: true, message: 'Invite sent successfully' };
		// error(400, 'Invite sent unsuccessfully');

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}
		const schoolId = parseInt(event.params.schoolId);

		const existingUser = await findIfUserExistsById({ username: form.data.email });

		if (existingUser) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'User already exists, please contact your administrator',
				status: 400,
				event
			});
		}

		let inviteToken = '';
		let htmlTemplate;

		try {
			htmlTemplate = await getLatestHtmlTemplateDataByType();
			if (!htmlTemplate) throw new Error('Failed to get html template data');
			const result = await db.transaction(async (trx) => {
				const schoolRes = await getSchoolDetailsById(schoolId, trx);
				if (!schoolRes.id) throw new Error('School not found or does not exist');

				let inviteRes = await createAdminUserInvite(
					{
						inviteData: {
							id: generateUserId(),
							name: form.data.name,
							email: form.data.email,
							inviteType: 'school',
							inviter: event.locals.user?.id ?? '',
							schoolId: schoolRes.id ?? null,
							districtId: schoolRes.districtId ?? null,
							isSent: true
						}
					},
					trx
				);

				if (!inviteRes) throw new Error('Failed to create invite');

				inviteToken = createAdminUserInviteToken(form.data.name, form.data.email, inviteRes.id);

				const newUser = await createNewUserWithDetails(
					{
						id: generateUserId(),
						username: form.data.email,
						name: form.data.name,
						phone: form.data.phone
					},
					trx
				);
				if (!newUser) throw new Error('Failed to create user');

				//associate user w/ school
				const newSchoolAdminRes = await createSchoolAdmin(
					{
						userId: newUser.id,
						schoolId: schoolRes.id
					},
					trx
				);
				if (!newSchoolAdminRes) throw new Error('Failed to associate user with school');

				// throw new Error('test error');

				return newUser;
			});

			const res = await event.fetch('/api/send-admin-email-invite', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					to: form.data.email,
					subject: 'You have been invited to join the platform',
					inviteLink: `${event.url.origin}/auth/register?inviteToken=${inviteToken}`,
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
			console.log('error => ', form, UnexpectedErrorMsg);
			setFlash({ type: 'error', message: UnexpectedErrorMsg }, event.cookies);
			return message(form, { status: 'error', text: UnexpectedErrorMsg });
		}

		const registerLink = `${event.url.origin}/auth/register?inviteToken=${inviteToken}`;
		console.log('register link =>', registerLink);

		return { success: true, message: 'Invite sent successfully' };
	}
};
