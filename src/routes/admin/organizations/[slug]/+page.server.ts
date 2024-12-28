import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	// console.log('params====================> ', params.slug);
	const parentData = await parent();
	const data = parentData.fetchedData.users.filter((school: any) => school.slug === params.slug)[0];
	return {
		// ...parentData,
		data,
		members: parentData.fetchedData.users.filter(
			(school: any) => school.districtId === data?.districtId
		)
	};
}) satisfies PageServerLoad;
