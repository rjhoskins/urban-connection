import { superValidate } from 'sveltekit-superforms';
import { inviteNewUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';
import { redirect } from '@sveltejs/kit';
import { createInviteToken } from '$lib/utils';

export const load: PageServerLoad = async ({ url }) => {
	// console.log('url => ', url);
	const token = url.searchParams.get('inviteToken');
	// async function getDistricts() {
	// 	return await db.select().from(table.districtsTable);
	// }
	// console.log('PageServerLoad ======================================================>');

	const form = await superValidate(zod(inviteNewUserSchema));
	// console.log('form => ', form);

	// Always return { form } in load functions https://superforms.rocks/faq#why-do-i-need-to-call-supervalidate-in-the-load-function

	return {
		token,
		form
	};
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('invite  form => ', form);

		return redirect(
			303,
			`/auth/register?inviteToken=${createInviteToken(form.data.name, form.data.email)}`
		);

		// TODO: Do something with the validated form.data
		// await db
		// 	.insert(table.schoolsTable)
		// 	// TODO: Use the form data to insert User data into the database
		// 	.values({ name: form.data.name, districtID: Number(form.data.districtId), createdBy: '1' });

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
