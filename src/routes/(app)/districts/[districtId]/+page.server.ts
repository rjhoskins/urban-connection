import type { PageServerLoad } from './$types';
import {
	getDistrictAdmin,
	getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminByDistrict,
	getDistrictDetailsById,
	getDistrictWithSchools
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import { error } from 'console';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	const districtId = event.params.districtId;
	const district = await getDistrictDetailsById(districtId);

	if (!district) {
		throw error(404, 'District not found');
	}
	return {
		district,
		adminData: await getDistrictAdmin(districtId),
		disctrictWithSchools: await getDistrictWithSchools(districtId),
		memberAssessmentData:
			await getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminByDistrict(districtId)
	};
}) satisfies PageServerLoad;
