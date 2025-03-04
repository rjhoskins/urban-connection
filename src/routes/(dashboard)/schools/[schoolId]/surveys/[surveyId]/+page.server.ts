import {
	getSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSingleSurveyResultsDataForSchoolAndDistrictAdmin,
	getSurveyData,
	getSurveyResultsData
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	console.log('event.params.schoolId =>', event.params.schoolId);
	console.log('event.params.surveyId =>', event.params.surveyId);

	const schoolNumber = parseInt(event.params.schoolId);
	const surveyNumber = parseInt(event.params.surveyId);
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
			adminDataFunc = () => getSchoolAdminBySchoolId(schoolNumber);
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
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolNumber);
	}

	// const adminData = await adminDataFunc();
	// console.log('adminData =>', adminData);

	// const school = await dataFunc();
	// console.log('school =>', school);

	// const surveyData = await getSurveyData(schoolNumber);
	// console.log('surveyData =>', surveyData);

	// const surveyResultsData = await getSurveyResultsData(schoolNumber);
	// console.log('surveyResultsData =>', surveyResultsData);

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolNumber),
		surveyResultsData: await getSingleSurveyResultsDataForSchoolAndDistrictAdmin(surveyNumber)
	};
};
