import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSingleSurveyResultsDataForSchoolAndDistrictAdmin,
	getSurveyData
} from '$lib/server/queries';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
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
	if (event.locals.user && event.locals.user.role === 'school_admin') {
		if (userId) {
			dataFunc = () => getSchoolForSchoolAdmin(userId, schoolId);
			adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		// at school admin level - need to get the school data for the school admin
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(schoolId);
			adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
		}
	}

	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc(),
		surveyData: await getSurveyData(schoolId),
		surveyResultsData: await getSingleSurveyResultsDataForSchoolAndDistrictAdmin(surveyId)
	};
};
