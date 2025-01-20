import { superValidate } from 'sveltekit-superforms';
import { inviteNewUserSchema, newUserTokenSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';
import { redirect } from '@sveltejs/kit';
import { createInviteToken, decodeInviteToken } from '$lib/utils';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');

	const form = await superValidate(zod(inviteNewUserSchema));

	return {
		token,
		form
	};
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');
		const token = event.url.searchParams.get('inviteToken');
		if (!token || !newUserTokenSchema.safeParse(decodeInviteToken(token)).success) {
			return message(form, 'Invalid token', { status: 400 });
		}
		const { name, email } = decodeInviteToken(token);

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			return message(form, 'Invalid form'); // Will return fail(400, { form }) since form isn't valid
		}

		try {
			// update invite - all invites should be marked as used
			const [inviteRes] = await db
				.update(table.userInvitesTable)
				.set({ inviteText: form.data.inviteText })
				.where(eq(table.userInvitesTable.email, form.data.email));
		} catch (error) {
			return message(form, '"Failed to create the resource due to an internal error.', {
				status: 400
			});
		}

		console.log('invite form => ', form);
		console.log('invite link => ', `/auth/register?inviteToken=${createInviteToken(name, email)}`);
		redirect(302, '/');

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
