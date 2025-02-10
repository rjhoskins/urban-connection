import * as db from '$lib/server/database.js';

export function load({ cookies }) {}

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log('data => ', data);
	}
};
