import type { LayoutServerLoad } from './$types';
import { users, districts, schools } from '$lib/data/data';

export const load = (async () => {
	return {
		fetchedData: { users, districts, schools }
	};
}) satisfies LayoutServerLoad;
