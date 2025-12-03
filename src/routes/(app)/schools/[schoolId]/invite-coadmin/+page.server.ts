import { inviteNewCoAdminUserSchema } from '$lib/schema';
import { handleInviteCoAdminSubmitEvent } from '$lib/server-events.js';
import { getLatestHtmlTemplateDataByType } from '$lib/server/queries';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(inviteNewCoAdminUserSchema));

	return {
		form,
		schoolAdminHtmlTemplate: await getLatestHtmlTemplateDataByType()
	};
};
export const actions = {
	default: async (event) => handleInviteCoAdminSubmitEvent(event)
};
