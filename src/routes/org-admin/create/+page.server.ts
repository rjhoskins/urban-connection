import { superValidate } from 'sveltekit-superforms';
import { createOrganizationSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const form = await superValidate(zod(createOrganizationSchema));

	// Always return { form } in load functions
	return { form };
};
export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createOrganizationSchema));

		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
