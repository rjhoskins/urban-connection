import * as db from '$lib/server/database.js';
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {}

export const actions = {
	submit: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log('submit server data => ', data);
		return { success: true, formData: JSON.stringify(data) };
	},
	finish: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log('finish server data => ', data);
		throw redirect(303, '/thank-you');
	}
};
