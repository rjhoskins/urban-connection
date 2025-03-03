import type { PageServerLoad } from './$types';
import {
	getDistrictAdmin,
	getDistrictWithSchools,
	getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminByDistrict
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	const districtId = parseInt(event.params.districtId);
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	return {
		district: await getDistrictWithSchools(districtId),
		adminData: await getDistrictAdmin(districtId),
		memberSurveyData:
			await getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminByDistrict(districtId)
	};
}) satisfies PageServerLoad;
