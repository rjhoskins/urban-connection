import { superValidate } from 'sveltekit-superforms';
import {
	inviteNewUserSchema,
	newUserTokenSchema,
	schoolAdminUserInviteHTMLEmailTemplateSchema
} from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';

import { redirect } from '@sveltejs/kit';
import {
	createAdminUserInviteToken,
	decodeAdminUserInviteToken,
	handleLogFlashReturnFormError
} from '$lib/utils';
import { eq, or, desc } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { INITIAL_HTML_DATA } from '$lib/constants.js';
import { htmlEmailTemplates } from '$lib/server/db/schema/index.js';
import { getLatestHtmlTemplateData } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('inviteToken');
	// console.log('token => ', token);

	const htmlTemplate = await getLatestHtmlTemplateData();
	console.log('loaded htmlTemplate => ', htmlTemplate);
	const inviteForm = await superValidate(zod(inviteNewUserSchema));
	const emailForm = await superValidate(zod(schoolAdminUserInviteHTMLEmailTemplateSchema));
	emailForm.data = htmlTemplate?.template?.keyPoints?.length
		? htmlTemplate.template
		: { ...INITIAL_HTML_DATA, keyPoints: [''] };

	// console.log('emailForm => ', emailForm);

	return {
		token,
		inviteForm,
		emailForm: emailForm,
		canEditForm: event.locals.user?.role === 'super_admin'
	};
};
export const actions: Actions = {
	invite: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');
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
		try {
			const htmlTemplate = await getLatestHtmlTemplateData();
			if (!htmlTemplate) {
				return handleLogFlashReturnFormError({
					type: 'error',
					form,
					message: 'No html template found',
					status: 404,
					event
				});
			}
			event.fetch('/api/send-admin-email', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					to: form.data.email,
					subject: 'You have been invited to join the platform',
					inviteLink: `${event.url.origin}/auth/register?inviteToken=${createAdminUserInviteToken(form.data.name, form.data.email, form.data.inviteId)}`,
					htmlEmailContent: htmlTemplate.template
				})
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: errorMessage,
				status: 500,
				event
			});
		}
		console.log(
			'invite link => ',
			`/auth/register?inviteToken=${createAdminUserInviteToken(form.data.name, form.data.email, form.data.inviteId)}`
		);

		setFlash({ type: 'success', message: 'Invite sent!' }, event.cookies);
		redirect(302, '/');
	},
	email: async (event) => {
		// const data = await event.request.formData();
		// const keyPoints = data.get('keyPoints');
		// for (const [key, value] of data.entries()) {
		// 	console.log('key, value', key, value);
		// }

		// console.log('keyPoints ==================> ', keyPoints);
		const form = await superValidate(
			event.request,
			zod(schoolAdminUserInviteHTMLEmailTemplateSchema)
		);

		console.log('form => ', form);
		if (!form.valid) {
			console.log('form.errors => ', form.errors);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}
		console.log('update admin html template form.data => ', form.data);
		try {
			// throw new Error('testing...');
			const [htmlEmailRes] = await db
				.insert(htmlEmailTemplates)
				.values({ template: form.data })
				.returning();
			console.log('htmlres => ', htmlEmailRes);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: errorMessage,
				status: 500,
				event
			});
		}

		setFlash({ type: 'success', message: 'Email template data saved' }, event.cookies);

		// return form;
	}
};
