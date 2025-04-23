/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool,
	getSchoolMemberAssessmentTotalsForSuperUser,
	getAssessmentData,
	getSchoolIDForSchoolAdmin
} from '$lib/server/queries';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	let schoolId = parseInt(event.params.schoolId) || '';
	const userId = event.locals.user.id;

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
		console.log('school admin!!!!!!!!!!!!!!!!!!!!!!!!!!====================');
		const userId = event.locals.user.id;
		schoolId = parseInt(await getSchoolIDForSchoolAdmin(userId));
		if (userId && schoolId) {
			schoolDataFunc = async () => getSchoolForSchoolAdmin(userId, schoolId);
			adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
			memberDataFunc = async () =>
				getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool(schoolId);
		}
	}
	if (event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			schoolDataFunc = async () => getSchoolForDistrictAdmin(userId, schoolId);
			adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
			memberDataFunc = async () =>
				getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool(schoolId);
		}
	}
	if (event.locals.user.role === 'super_admin') {
		console.log('super admin!!!!!!!!!!!!!!!!!!!!!!!!!!====================');
		schoolDataFunc = async () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
		memberDataFunc = async () => getSchoolMemberAssessmentTotalsForSuperUser(schoolId);
	}

	// console.log('Loading data for school', schoolId);
	console.log('Admin data call:', await adminDataFunc());
	// console.log('School data call:', await schoolDataFunc());
	// console.log('Assessment data call:', await getAssessmentData(schoolId));
	// console.log('Member data call:', await memberDataFunc());

	return {
		adminData: await adminDataFunc(),
		school: await schoolDataFunc(),
		assessmentData: await getAssessmentData(schoolId),
		memberData: await memberDataFunc()
	};
};
