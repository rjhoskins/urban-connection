/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {
	getSchoolAdminBySchoolId,
	getSchoolByIdWithAdmins,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool,
	getSchoolMemberAssessmentTotalsForSchoolBySchoolId,
	getSchoolMemberAssessmentTotalsForSuperUser
} from '$lib/server/queries';

import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';
import { dev } from '$app/environment';
import Stripe from 'stripe';
import { is } from 'drizzle-orm';

const secretKey = dev ? STRIPE_SECRET_TEST_KEY : STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey as string);

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const schoolId = event.params.schoolId;
	const userId = event.locals.user.id;

	let schoolWithAdminsDataFunc: () => Promise<any> = async () => {
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
			schoolWithAdminsDataFunc = async () => getSchoolByIdWithAdmins({ id: schoolId });
			memberDataFunc = async () => getSchoolMemberAssessmentTotalsForSchoolBySchoolId(schoolId);
		}
	}
	if (event.locals.user.role === 'super_admin') {
		console.log('super admin!!!!!!!!!!!!!!!!!!!!!!!!!!====================');
		schoolWithAdminsDataFunc = async () => getSchoolForSuperAdmin(schoolId);
		memberDataFunc = async () => getSchoolMemberAssessmentTotalsForSchoolBySchoolId(schoolId);
	}

	return {
		stripeProducts: await stripe.products.list({ limit: 2, active: true }),
		schoolWithAdmins: await schoolWithAdminsDataFunc(),
		memberData: await memberDataFunc(),
		isSuperAdmin: event.locals.user.role === 'super_admin'
	};
};
