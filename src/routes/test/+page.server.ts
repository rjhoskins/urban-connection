import * as db from '$lib/server/database.js';
import { generateQuestionnaire } from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export async function load(event) {
	// console.log(' test load=============================>');
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	return {
		surveyData: await generateQuestionnaire()
	};
}

export const actions = {
	submit: async ({ cookies, request }) => {
		const data = await request.formData();
		const formData = Object.fromEntries(data);
		console.log('submit server data => ', data);
		return { success: true, formData };
	},
	finish: async ({ cookies, request }) => {
		const data = await request.formData();
		const formData = Object.fromEntries(data);
		console.log('finish server data => ', data);
		setFlash({ type: 'success', message: 'Survy Completed Thank you!' }, cookies);
		throw redirect(303, '/thank-you');
	}
};
