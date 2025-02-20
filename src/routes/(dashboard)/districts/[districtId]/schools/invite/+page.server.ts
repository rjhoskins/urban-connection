import { superValidate } from 'sveltekit-superforms';
import {
	inviteNewUserSchema,
	newUserTokenSchema,
	userInviteHTMLEmailTemplateSchema
} from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';

import { redirect } from '@sveltejs/kit';
import { createInviteToken, decodeInviteToken, handleLogFlashReturnFormError } from '$lib/utils';

import { setFlash } from 'sveltekit-flash-message/server';
import { getLatestHtmlTemplateData, updateHtmlTemplateData } from '$lib/server/queries.js';
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');
	console.log('token => ', token);

	const htmlTemplate = await getLatestHtmlTemplateData();
	console.log('htmlTemplate => ', htmlTemplate.template);
	const inviteForm = await superValidate(zod(inviteNewUserSchema));
	const emailForm = await superValidate(
		htmlTemplate.template!,
		zod(userInviteHTMLEmailTemplateSchema)
	);

	return {
		htmlTemplateData: await getLatestHtmlTemplateData(),
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

			event.fetch('/api/send-html-email', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					to: form.data.email,
					subject: 'You have been invited to join the platform',
					inviteLink: `${event.url.origin}/auth/register?inviteToken=${createInviteToken(form.data.name, form.data.email, form.data.inviteId)}`,
					htmlEmailContent: htmlTemplate.template
				})
			});
			throw new Error('testing...');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		console.log('invite form => ', form);
		console.log(
			'invite link => ',
			`/auth/register?inviteToken=${createInviteToken(form.data.name, form.data.email, form.data.inviteId)}`
		);
		// TODO????
		// redirect(302,
		// 	`/=${createInviteToken(name, email, inviteId)}`);
		setFlash({ type: 'success', message: 'Invite sent!' }, event.cookies);
		redirect(302, '/');

		// Display a success status message
	},
	email: async (event) => {
		const form = await superValidate(event, zod(userInviteHTMLEmailTemplateSchema));
		if (!form.valid) {
			handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}
		const htmlEmailRes = await updateHtmlTemplateData({ template: form.data });

		setFlash({ type: 'success', message: 'Email template data saved' }, event.cookies);
	}
};
