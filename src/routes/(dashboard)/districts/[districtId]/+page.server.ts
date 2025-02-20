import type { PageServerLoad } from './$types';
import { getDistrictAdmin, getDistrictWithSchools } from '$lib/server/queries';

export const load = (async (event) => {
	return {
		district: await getDistrictWithSchools(parseInt(event.params.districtId)),
		adminData: await getDistrictAdmin(parseInt(event.params.districtId))
	};
}) satisfies PageServerLoad;
