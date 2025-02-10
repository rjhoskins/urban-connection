import { message, superValidate } from 'sveltekit-superforms/server';
import { inviteNewUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';
import { redirect } from '@sveltejs/kit';
import { createInviteToken } from '$lib/utils';
import { SERVER_ERROR_MESSAGES } from '$lib/constants.js';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(inviteNewUserSchema));

	return {
		form
	};
};
// export const actions: Actions = {

// };
