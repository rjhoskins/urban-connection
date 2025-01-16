import type { LayoutServerLoad } from './$types';
import { users, districts, schools } from '$lib/data/data';

export const load = (async (event) => {
	// console.log('Loading main layout data');
	return {
		user: event.locals.user
		// fetchedData: { users, districts, schools }
	};
}) satisfies LayoutServerLoad;
