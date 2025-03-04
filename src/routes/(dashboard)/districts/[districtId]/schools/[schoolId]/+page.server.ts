/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';
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
	if (event.locals.user.role === 'school_admin') {
		throw redirect(302, '/unauthorized');
	}

	const schoolId = parseInt(event.params.schoolId);

	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let memberDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
			memberDataFunc = async () =>
				getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId);
		}
	}
	if (event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
		memberDataFunc = async () => getSchoolMemberSurveyTotalsForSuperUser(schoolId);
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolId),
		memberData: await memberDataFunc()
	};
};
