/** @type {import('./$types').PageServerLoad} */

export const load = async ({ parent }) => {
	const parentData = await parent();
	return {
		...parentData,
		data: parentData.fetchedData.schools
	};
};
