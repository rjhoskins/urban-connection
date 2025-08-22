/** @type {import('./$types').PageServerLoad} */
import Stripe from 'stripe';
import { dev } from '$app/environment';
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
import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';

const secretKey = dev ? STRIPE_SECRET_TEST_KEY : STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey as string);
export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	let schoolId = parseInt(event.params.schoolId) || 0;
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
		if (!userId) error(403, 'User ID not found for school admin');

		const schoolIdResult = await getSchoolIDForSchoolAdmin(userId!);
		if (!schoolIdResult) error(404, 'School ID not found for school admin');
		schoolId = schoolIdResult;

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

	console.log('Loading data for school', schoolId);
	console.log('Admin data call:', await adminDataFunc());
	console.log('School data call:', await schoolDataFunc());
	console.log('Assessment data call:', await getAssessmentData(schoolId));
	console.log('Member data call:', await memberDataFunc());

	return {
		stripeProducts: await stripe.products.list({ limit: 2, active: true }),
		adminData: await adminDataFunc(),
		school: await schoolDataFunc(),
		assessmentData: await getAssessmentData(schoolId),
		memberData: await memberDataFunc()
	};
};
