import type { LayoutServerLoad } from './$types';
import { users, districts, schools } from '$lib/data/data';

export const load = (async ({ parent }) => {
	// console.log('Loading admin layout data');
	const parentData = await parent();
	return {
		...parentData
	};
}) satisfies LayoutServerLoad;
