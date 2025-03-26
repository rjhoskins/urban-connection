/** @type {import('./$types').LayoutServerData} */
import { error, redirect } from '@sveltejs/kit';
import {
	getSchoolAdminBySchoolId,
	getSchoolDetailsById,
	getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool,
	getSurveyData
} from '$lib/server/queries';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	// if (event.locals.user.role !== 'school_admin') {
	// 	throw redirect(401, '/auth/login');
	// }

	let schoolId = parseInt(event.params.schoolId);
	const school = await getSchoolDetailsById(schoolId);
	if (!school) {
		throw error(404, 'School not found');
	}

	// if (schoolAdminId !== event.locals.user.id && event.locals.user.role !== 'district_admin' && event.locals.user.role !== 'super_admin') { {
	// 	throw error(401, 'Unauthorized');
	// }

	return {
		adminData: await getSchoolAdminBySchoolId(schoolId),
		school,
		surveyData: await getSurveyData(schoolId),
		memberData: await getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId),
		layout: 'hello'
	};
};
