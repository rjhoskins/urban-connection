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
	// if (event.locals.user.role === 'school_admin') {
	// 	throw error(401, '/unauthorized');
	// }

	const schoolId = parseInt(event.params.schoolId);
	console.log('schoolId----------------', schoolId);

	let schoolDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let memberDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user.role === 'school_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			schoolDataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
			memberDataFunc = async () =>
				getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId);
		}
	}
	if (event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			schoolDataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
			memberDataFunc = async () =>
				getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId);
		}
	}
	if (event.locals.user.role === 'super_admin') {
		schoolDataFunc = () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
		memberDataFunc = async () => getSchoolMemberSurveyTotalsForSuperUser(schoolId);
	}

	return {
		adminData: await adminDataFunc(),
		school: await schoolDataFunc(),
		surveyData: await getSurveyData(schoolId),
		memberData: await memberDataFunc()
	};
};
