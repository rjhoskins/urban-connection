import { superValidate } from 'sveltekit-superforms';
import {
	inviteNewAdminOrCoAdminUserSchema,
	schoolAdminUserInviteHTMLEmailTemplateSchema
} from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { handleLogFlashReturnFormError } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import { INITIAL_HTML_DATA } from '$lib/server/constants.js';
import { htmlEmailTemplates } from '$lib/server/db/schema/index.js';
import { getUnusedAdminInviteById, getLatestHtmlTemplateDataByType } from '$lib/server/queries';
import {
	handleInviteCoAdminSubmitEvent,
	handleInviteInitialAdminSubmitEvent
} from '$lib/server-events.js';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || event.locals.user.role !== 'super_admin') {
		return redirect(302, '/auth/login');
	}
	console.log('INVITE +page.server.ts load ===================');
	const adminInviteId = event.url.searchParams.get('adminInviteId');
	console.log('adminInviteId => ', adminInviteId);
	if (!adminInviteId) {
		throw error(400, 'No invite ID provided');
	}
	const unusedAdminUserInvite = await getUnusedAdminInviteById({ inviteId: adminInviteId! });
	if (!unusedAdminUserInvite) {
		setFlash(
			{ type: 'error', message: 'Initial Admin Invite not found or already used' },
			event.cookies
		);
		throw error(404, 'Initial Admin Invite not found or already used');
	}

	// console.log('isUsed => ', isUsedRes?.isUsed);
	console.log('unusedAdminUserInvite => ', unusedAdminUserInvite);

	const htmlTemplate = await getLatestHtmlTemplateDataByType();
	console.log('loaded htmlTemplate => ', htmlTemplate);
	const inviteForm = await superValidate(zod(inviteNewAdminOrCoAdminUserSchema));
	const emailForm = await superValidate(zod(schoolAdminUserInviteHTMLEmailTemplateSchema));
	emailForm.data = htmlTemplate?.template?.keyPoints?.length
		? htmlTemplate.template
		: { ...INITIAL_HTML_DATA, keyPoints: [''] };

	// console.log('emailForm => ', emailForm);
	// return error(500, 'Email sending disabled for demo');

	return {
		unusedAdminUserInvite,
		inviteForm,
		emailForm: emailForm,
		canEditForm: event.locals.user?.role === 'super_admin'
	};
};
export const actions: Actions = {
	invite: async (event) => handleInviteInitialAdminSubmitEvent(event),
	email: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'super_admin')
			return redirect(302, '/auth/login');
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
	}
};
