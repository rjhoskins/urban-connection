/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {
	getSchoolAdminBySchoolId,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool,
	getSchoolMemberAssessmentTotalsForSuperUser,
	getAssessmentData
} from '$lib/server/queries';

import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';
import { dev } from '$app/environment';
import Stripe from 'stripe';

const secretKey = dev ? STRIPE_SECRET_TEST_KEY : STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey as string);

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const schoolId = parseInt(event.params.schoolId);
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
		redirect(302, '/schools/' + schoolId);
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

	return {
		adminData: await adminDataFunc(),
		school: await schoolDataFunc(),
		assessmentData: await getAssessmentData(schoolId),
		memberData: await memberDataFunc(),
		stripeProducts: await stripe.products.list({ limit: 2, active: true })
	};
};
