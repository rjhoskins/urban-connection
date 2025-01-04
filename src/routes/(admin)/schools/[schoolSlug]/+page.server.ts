import { schools } from '$lib/data/data';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	// console.log('params====================> ', params.slug);
	const parentData = await parent();
	const data = parentData.fetchedData.schools.filter(
		(school: any) => school.slug === params.schoolSlug
	)[0];
	return {
		// ...parentData,
		data
	};
}) satisfies PageServerLoad;