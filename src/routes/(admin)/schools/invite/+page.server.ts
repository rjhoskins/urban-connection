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
import { eq, or } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';

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
		const { name, email, inviteId } = decodeInviteToken(token);

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			return message(form, 'Invalid form');
		}

		try {
			const [inviteRes] = await db
				.update(table.userInvitesTable)
				.set({ inviteText: form.data.inviteText, isSent: true })
				.where(
					or(
						// update specific invite but all past invites should be marked as used too
						eq(table.userInvitesTable.id, inviteId),
						eq(table.userInvitesTable.email, form.data.email)
					)
				);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		console.log('invite form => ', form);
		console.log(
			'invite link => ',
			`/auth/register?inviteToken=${createInviteToken(name, email, inviteId)}`
		);
		// TODO????
		// redirect(302,
		// 	`/=${createInviteToken(name, email, inviteId)}`);
		setFlash({ type: 'success', message: 'Invite sent!' }, event.cookies);
		redirect(302, '/');

		// Display a success status message
	}
};
