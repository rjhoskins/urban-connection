import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const parentData = await parent();
	return {
		...parentData,
		data: parentData.fetchedData.users
			.filter((school: any) => school.type === 'District/Group')
			.map((user: any) => ({
				...user,
				district: parentData.fetchedData.districts.find(
					(district: any) => district.id === user.districtId
				)
			}))
	};
}) satisfies PageServerLoad;
