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
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';
import { redirect } from '@sveltejs/kit';
import { createInviteToken, decodeInviteToken } from '$lib/utils';
import { eq, or, desc } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { INITIAL_HTML_DATA } from '$lib/constants.js';

export const load: PageServerLoad = async ({ url }) => {
	console.log('url ===========================================> ');
	const token = url.searchParams.get('inviteToken');
	console.log('token => ', token);
	async function getLatestHtmlTemplateData() {
		return await db
			.select({ template: table.htmlEmailTemplatesTable.template })
			.from(table.htmlEmailTemplatesTable)
			.orderBy(
				desc(table.htmlEmailTemplatesTable.createdAt),
				desc(table.htmlEmailTemplatesTable.id)
			)
			.limit(1);
	}
	const [htmlTemplate] = await getLatestHtmlTemplateData();
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
			// const [inviteRes] = await db
			// 	.update(table.userInvitesTable)
			// 	.set({ isSent: true })
			// 	.where(
			// 		or(
			// 			// update specific invite but all past invites should be marked as used too
			// 			eq(table.userInvitesTable.id, form.data.inviteId),
			// 			eq(table.userInvitesTable.email, form.data.email)
			// 		)
			// 	);
			// if (!inviteRes) throw new Error('Invite not found');
			event.fetch('/api/send-html-email', {
				method: 'POST'
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
			setFlash({ type: 'error', message: 'Invalid form' }, event.cookies);
			return message(form, 'Invalid form');
		}
		const [htmlEmailRes] = await db
			.insert(table.htmlEmailTemplatesTable)
			.values({ template: form.data })
			.returning();

		setFlash({ type: 'success', message: 'Email template data saved' }, event.cookies);
		// console.log('htmlres => ', htmlEmailRes);
		// console.log('form => ', form);
		// return form;
	}
};
