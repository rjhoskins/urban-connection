/** @type {import('./$types').PageServerLoad} */
import {
	getSchoolForSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSuperAdmin,
	getSchoolAdmin,
	getSurveyData,
	getQuestionData,
	getSchoolDomainResultsData,
	getSchoolSurveyResultsData,
	getLoggedInSchoolAdminsSchool
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const userSchoolId = (await getLoggedInSchoolAdminsSchool(event.locals.user.id))?.id ?? 0;
	if (userSchoolId === 0) throw redirect(302, '/auth/login');

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
			dataFunc = () => getSchoolForSchoolAdmin(userId, userSchoolId);
			adminDataFunc = () => getSchoolAdmin(userSchoolId);
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(userSchoolId);
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(userSchoolId);
		adminDataFunc = async () => getSchoolAdmin(userSchoolId);
		// 	if (event.locals.user) {
		// 		return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
		// 	}
		// 	return null;
		// };
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(userSchoolId),
		surveyResultsData: await getSchoolSurveyResultsData(userSchoolId),
		questionData: await getQuestionData(userSchoolId),
		domainResultsData: await getSchoolDomainResultsData(userSchoolId)
	};
};
