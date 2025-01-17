import { message, superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema } from '$lib/schema';
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
	if (!event.locals.user) return redirect(302, '/auth/login');

	async function getDistricts() {
		return await db.select().from(table.districtsTable);
	}
	// console.log('PageServerLoad ======================================================>');

	const form = await superValidate(zod(createSchoolSchema));
	// console.log('form => ', form);

	// Always return { form } in load functions https://superforms.rocks/faq#why-do-i-need-to-call-supervalidate-in-the-load-function

	return {
		districts: await getDistricts(),
		form
	};
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');

		const form = await superValidate(event, zod(createSchoolSchema));

		if (!form.valid) {
			// return fail(400, { form });
			return message(form, 'Invalid form'); // Will return fail(400, { form }) since form isn't valid
		}

		console.log('create form => ', form);
		let schoolResult: any;
		let inviteResult: any;
		try {
			schoolResult = await db
				.insert(table.schoolsTable)
				.values({
					name: form.data.name,
					districtID: Number(form.data.districtId),
					createdBy: event.locals.user.id
				})
				.returning();
			console.log('schoolResult => ', schoolResult);
			// create invite here, use it in invite page to...
			inviteResult = await db
				.insert(table.userInvitesTable)
				.values({
					name: form.data.adminName,
					email: form.data.adminEmail,
					schoolId: schoolResult[0].id as number,
					role: 'school_admin', // default role
					inviter: event.locals.user.id,
					inviteType: 'school' // default invite type
				})
				.returning();

			console.log('inviteResult => ', inviteResult);
		} catch (error) {
			return message(form, SERVER_ERROR_MESSAGES[400], {
				status: 400
			});
		}

		if (!schoolResult || !inviteResult)
			return message(form, SERVER_ERROR_MESSAGES[400], {
				status: 400
			});
		redirect(
			303,
			`/schools/invite?inviteToken=${createInviteToken(form.data.adminName, form.data.adminEmail)}`
		);

		console.log('schoolResult => ', schoolResult);
		console.log('inviteResult => ', inviteResult);

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
