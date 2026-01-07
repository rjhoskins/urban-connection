/** @type {import('./$types').PageServerLoad} */
/** @type {import('./$types').Actions} */
import { superValidate } from 'sveltekit-superforms/server';
import { inviteNewAdminOrCoAdminUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { getLatestHtmlTemplateDataByType } from '$lib/server/queries.js';

import { handleInviteCoAdminSubmitEvent } from '$lib/server-events';

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(inviteNewAdminOrCoAdminUserSchema));

	return { form, schoolAdminHtmlTemplate: await getLatestHtmlTemplateDataByType() };
};
export const actions = {
	default: async (event) => handleInviteCoAdminSubmitEvent(event)
};
