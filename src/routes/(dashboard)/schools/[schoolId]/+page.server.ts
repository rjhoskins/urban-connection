/** @type {import('./$types').PageServerLoad} */
import {
	getSchoolForSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSuperAdmin,
	getSchoolAdmin,
	getSurveyData,
	getQuestionData,
	getSchoolDomainResultsData
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
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
			dataFunc = () => getSchoolForSchoolAdmin(userId, Number(event.params.schoolId));
			adminDataFunc = () => getSchoolAdmin(Number(event.params.schoolId));
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(Number(event.params.schoolId));
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(Number(event.params.schoolId));
		adminDataFunc = async () => getSchoolAdmin(Number(event.params.schoolId));
		// adminDataFunc = async () => {
		// 	if (event.locals.user) {
		// 		return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
		// 	}
		// 	return null;
		// };
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(Number(event.params.schoolId)),
		questionData: await getQuestionData(Number(event.params.schoolId)),
		domainResultsData: await getSchoolDomainResultsData(Number(event.params.schoolId))
	};
};
