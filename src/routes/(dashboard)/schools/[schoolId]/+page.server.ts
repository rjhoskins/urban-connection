/** @type {import('./$types').PageServerLoad} */
import {
	getSchoolForSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSuperAdmin,
	getSurveyData,
	getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool
	// getSchoolAdminBySchoolId
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const schoolId = parseInt(event.params.schoolId);

	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user && event.locals.user.role === 'school_admin') {
		console.log('school_admin user =======================> ');
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForSchoolAdmin(userId, schoolId);
			// adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(schoolId);
		// adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
	}

	return {
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolId),
		memberData: await getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(schoolId)
	};
};
