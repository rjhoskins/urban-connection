import { superValidate } from 'sveltekit-superforms';
import { createSchoolSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';

export const load: PageServerLoad = async ({ params }) => {
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
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createSchoolSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		console.log('create form => ', form);

		// TODO: Do something with the validated form.data
		// await db
		// 	.insert(table.schoolsTable)
		// 	// TODO: Use the form data to insert User data into the database
		// 	.values({ name: form.data.name, districtID: Number(form.data.districtId), createdBy: '1' });

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
