/** @type {import('./$types').PageServerLoad} */
import {
	getSchoolForSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSuperAdmin,
	getSchoolAdmin,
	getSurveyData,
	getQuestionData,
	getSchoolDomainResultsData,
	getSurveyResultsData
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const schoolNumber = parseInt(event.params.schoolId);
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
			dataFunc = () => getSchoolForSchoolAdmin(userId, schoolNumber);
			adminDataFunc = () => getSchoolAdmin(schoolNumber);
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(schoolNumber);
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(schoolNumber);
		adminDataFunc = async () => getSchoolAdmin(schoolNumber);
		// 	if (event.locals.user) {
		// 		return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
		// 	}
		// 	return null;
		// };
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolNumber),
		surveyResultsData: await getSurveyResultsData(schoolNumber),
		questionData: await getQuestionData(schoolNumber),
		domainResultsData: await getSchoolDomainResultsData(schoolNumber)
	};
};
