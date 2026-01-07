import { superValidate } from 'sveltekit-superforms';
import {
	inviteNewCoAdminUserSchema,
	schoolAdminUserInviteHTMLEmailTemplateSchema
} from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { handleLogFlashReturnFormError } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import { INITIAL_HTML_DATA } from '$lib/server/constants.js';
import { htmlEmailTemplates } from '$lib/server/db/schema/index.js';
import { getLatestHtmlTemplateDataByType, getUnusedAdminInviteById } from '$lib/server/queries';
import { handleInviteCoAdminSubmitEvent } from '$lib/server-events.js';
import { error } from 'console';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const adminInviteId = event.url.searchParams.get('adminInviteId');
	console.log('adminInviteId => ', adminInviteId);
	if (!adminInviteId) {
		throw error(404, 'Invite not found or invalid');
	}

	const inviteForm = await superValidate(zod(inviteNewCoAdminUserSchema));
	if (!inviteForm.valid) {
		console.log('inviteForm.errors => ', inviteForm.errors);
	}

	const unusedAdminUserInvite = await getUnusedAdminInviteById({ inviteId: adminInviteId! });
	if (!unusedAdminUserInvite) {
		throw error(404, 'Invite not found or invalid');
	}

	console.log('unusedAdminUserInvite => ', unusedAdminUserInvite);
	const htmlTemplate = await getLatestHtmlTemplateDataByType();
	console.log('loaded htmlTemplate => ', htmlTemplate);
	const emailForm = await superValidate(zod(schoolAdminUserInviteHTMLEmailTemplateSchema));
	emailForm.data = htmlTemplate?.template?.keyPoints?.length
		? htmlTemplate.template
		: { ...INITIAL_HTML_DATA, keyPoints: [''] };

	return {
		unusedAdminUserInvite,
		inviteForm,
		emailForm: emailForm,
		schoolAdminHtmlTemplate: await getLatestHtmlTemplateDataByType(),
		canEditForm: event.locals.user?.role === 'super_admin'
	};
};
export const actions: Actions = {
	invite: async (event) => handleInviteCoAdminSubmitEvent(event),
	email: async (event) => {
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
