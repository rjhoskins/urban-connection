import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSingleAssessmentResultsDataForSchoolAndDistrictAdmin,
	getSingleAssessmentResultsDataForSuperAdmin,
	getAssessmentData
} from '$lib/server/queries';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	console.log('load function for assessment results page=======================');
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	if (event.locals.user.role === 'school_admin') {
		// error(403, 'not authorized');
	}

	const schoolId = parseInt(event.params.schoolId);
	const assessmentId = parseInt(event.params.assessmentId);
	const userId = event.locals.user.id;

	let schoolDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	let assessmentResultsDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user && event.locals.user.role === 'school_admin') {
		// at school admin level -  need to get the school data for the school admin
		if (userId) {
			console.log('Setting up functions for school admin');
			schoolDataFunc = () => {
				console.log('Executing schoolDataFunc for school admin');
				return getSchoolForSchoolAdmin(userId, schoolId);
			};
			adminDataFunc = async () => {
				console.log('Executing adminDataFunc for school admin');
				return getSchoolAdminBySchoolId(schoolId);
			};
			assessmentResultsDataFunc = () => {
				console.log('Executing assessmentResultsDataFunc for school admin');
				return getSingleAssessmentResultsDataForSchoolAndDistrictAdmin(assessmentId);
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		// at school admin level -  need to get the school data for the school admin
		if (userId) {
			schoolDataFunc = () => getSchoolForDistrictAdmin(userId, schoolId);
			adminDataFunc = () => getSchoolAdminBySchoolId(schoolId);
			assessmentResultsDataFunc = () =>
				getSingleAssessmentResultsDataForSchoolAndDistrictAdmin(assessmentId);
		}
	}

	if (event.locals.user && event.locals.user.role === 'super_admin') {
		schoolDataFunc = () => getSchoolForSuperAdmin(schoolId);
		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
		assessmentResultsDataFunc = () => getSingleAssessmentResultsDataForSuperAdmin(assessmentId);
	}
	console.log('here in the load function');

	return {
		adminData: await adminDataFunc(),
		school: await schoolDataFunc(),
		assessmentData: await getAssessmentData(schoolId),
		assessmentResultsData: await assessmentResultsDataFunc()
	};
};
