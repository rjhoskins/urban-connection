import { superValidate } from 'sveltekit-superforms';
import {
	inviteNewUserSchema,
	newUserTokenSchema,
	userInviteHTMLEmailTemplateSchema
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

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');
	// console.log('token => ', token);

	const htmlTemplate = await getLatestHtmlTemplateData();
	console.log('htmlTemplate => ', htmlTemplate?.template);
	const inviteForm = await superValidate(zod(inviteNewUserSchema));
	const emailForm = await superValidate(zod(userInviteHTMLEmailTemplateSchema));
	emailForm.data = htmlTemplate?.template || {
		greeting: '',
		definition: '',
		keyPoints: [],
		closing: '',
		callToAction: '',
		registrationLinkText: ''
	};

	return {
		token,
		inviteForm,
		emailForm
	};
};
export const actions: Actions = {
	invite: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');
		const form = await superValidate(event, zod(inviteNewUserSchema));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'errorMessage' }, event.cookies);
			return message(form, 'Invalid form');
		}
		try {
			const htmlTemplate = await getLatestHtmlTemplateData();
			if (!htmlTemplate) {
				return handleLogFlashReturnFormError(
					{ type: 'error', message: 'No html template found' },
					event.cookies
				);
			}
			event.fetch('/api/send-html-email', {
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
		const form = await superValidate(event, zod(userInviteHTMLEmailTemplateSchema));
		console.log('form => ', form);
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid form' }, event.cookies);
			return message(form, 'Invalid form');
		}
		const [htmlEmailRes] = await db
			.insert(htmlEmailTemplates)
			.values({ template: form.data })
			.returning();
		setFlash({ type: 'success', message: 'Email template data saved' }, event.cookies);
		// console.log('htmlres => ', htmlEmailRes);
		// console.log('form => ', form);
		// return form;
	}
};
