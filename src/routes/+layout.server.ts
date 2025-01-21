import type { LayoutServerLoad } from './$types';
import { users, districts, schools } from '$lib/data/data';
// import { loadFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
	// console.log('Loading main layout data');
	return {
		user: event.locals.user
	};
}) satisfies LayoutServerLoad;
