import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSingleSurveyResultsDataForSchoolAndDistrictAdmin,
	getSingleSurveyResultsDataForSuperAdmin,
	getSurveyData
} from '$lib/server/queries';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	if (event.locals.user.role === 'school_admin') {
		error(403, 'not authorized');
	}

	const schoolId = parseInt(event.params.schoolId);
	const surveyId = parseInt(event.params.surveyId);
	const userId = event.locals.user.id;

	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let surveyResultsDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user && event.locals.user.role === 'district_admin') {
		// at school admin level -  need to get the school data for the school admin
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
			surveyResultsDataFunc = () => getSingleSurveyResultsDataForSchoolAndDistrictAdmin(surveyId);
		}
	}

	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
		surveyResultsDataFunc = () => getSingleSurveyResultsDataForSuperAdmin(surveyId);
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolId),
		surveyResultsData: await surveyResultsDataFunc()
	};
};
