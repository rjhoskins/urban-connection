/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool,
	getSchoolMemberSurveyTotalsForSuperUser,
	getSurveyData
} from '$lib/server/queries';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	if (event.locals.user.role !== 'school_admin') {
		throw redirect(302, '/auth/login');
	}

	const schoolId = parseInt(event.params.schoolId);
	const userId = event.locals.user.id;

	return {
		adminData: await getSchoolAdminBySchoolId(schoolId),
		school: await getSchoolForSchoolAdmin(userId, schoolId),
		surveyData: await getSurveyData(schoolId),
		memberData: await getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId)
	};
};
