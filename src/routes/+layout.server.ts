import type { LayoutServerLoad } from './$types';
import { users, districts, schools } from '$lib/data/data';
import { loadFlash } from 'sveltekit-flash-message/server';
import { redirect } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	return {
		user: event.locals.user
	};
});
