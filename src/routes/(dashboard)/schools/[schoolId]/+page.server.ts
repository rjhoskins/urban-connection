/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {
	getLoggedInSchoolAdminsSchool,
	getSchoolAdminBySchoolId,
	getSchoolForSchoolAdmin,
	getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool,
	getSurveyData
} from '$lib/server/queries';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	if (event.locals.user.role !== 'school_admin') {
		throw redirect(401, '/auth/login');
	}

	const userId = event.locals.user.id;
	const schoolAdminsSchool = await getLoggedInSchoolAdminsSchool(userId);
	if (!schoolAdminsSchool) {
		throw error(404, 'School not found');
	}
	const schoolId = schoolAdminsSchool.id;

	return {
		adminData: await getSchoolAdminBySchoolId(schoolId),
		school: await getSchoolForSchoolAdmin(userId, schoolId),
		surveyData: await getSurveyData(schoolId),
		memberData: await getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId)
	};
};
