/** @type {import('./$types').PageServerLoad} */
import Stripe from 'stripe';
import { dev } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import {
	getAssessmentDataBySchoolId,
	getSchoolAdminBySchoolId,
	getSchoolMemberAssessmentTotalsForSchoolBySchoolId,
	getSchoolById,
	getSchoolByIdWithAdmins,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin,
	getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool,
	getSchoolMemberAssessmentTotalsForSuperUser
	// getAssessmentDatBySchoolId,
	// getSchoolIDsForSchoolAdmin,
	// getSchoolAssessmentDataWithSummaryResultBySchoolId
} from '$lib/server/queries';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';

const secretKey = dev ? STRIPE_SECRET_TEST_KEY : STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey as string);
export const load = async (event) => {
	let schoolResult: Awaited<ReturnType<typeof getSchoolById>> | null = null;
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	let schoolId = event.params.schoolId;
	const userId = event.locals.user.id;

	let schoolWithAdminsDataFunc: () => Promise<any> = async () => {
		return null;
	};

	let memberDataFunc: () => Promise<any> = async () => {
		return null;
	};

	if (event.locals.user.role === 'school_admin') {
		console.log('school admin![schoolId] LAYOUT');
		const userId = event.locals.user.id;
		if (!userId) error(403, 'User ID not found for school admin');
		const schoolResult = await getSchoolById({ id: schoolId });
		if (userId && schoolResult) {
			schoolWithAdminsDataFunc = async () => getSchoolByIdWithAdmins({ id: schoolResult.schoolId });
			memberDataFunc = async () =>
				getSchoolMemberAssessmentTotalsForSchoolBySchoolId(schoolResult.schoolId);
			console.log('===schoolResult===:', schoolResult);
		}
	}
	// if (event.locals.user.role === 'district_admin') {
	// 	const userId = event.locals.user.id;
	// 	if (userId) {
	// 		schoolDataFunc = async () => getSchoolForDistrictAdmin(userId, schoolId);
	// 		adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
	// 		memberDataFunc = async () =>
	// 			getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool(schoolId);
	// 	}
	// }
	// if (event.locals.user.role === 'super_admin') {
	// 	console.log('super admin!!!!!!!!!!!!!!!!!!!!!!!!!!====================');
	// 	schoolDataFunc = async () => getSchoolForSuperAdmin(schoolId);
	// 	adminDataFunc = async () => getSchoolAdminBySchoolId(schoolId);
	// 	memberDataFunc = async () => getSchoolMemberAssessmentTotalsForSuperUser(schoolId);
	// }

	// console.log('Loading data for school', schoolId);
	// console.log('Admin data call:', await adminDataFunc());
	// console.log('School data call:', await schoolDataFunc());
	// console.log('Assessment data call:', await getAssessmentData(schoolId));
	// console.log('Member data call:', await memberDataFunc());

	const start = performance.now();
	const [stripeProducts, schoolWithAdmins, memberData] = await Promise.all([
		(async () => {
			const t0 = performance.now();
			const result = await stripe.products.list({ limit: 2, active: true });

			console.log(`Stripe products fetch took ${performance.now() - t0}ms`);
			return result;
		})(),
		(async () => {
			const t0 = performance.now();
			const result = await schoolWithAdminsDataFunc();
			console.log(`schoolWithAdminsDataFunc data fetch took ${performance.now() - t0}ms`);
			return result;
		})(),

		(async () => {
			const t0 = performance.now();
			const result = await memberDataFunc();
			console.log(`Member data fetch took ${performance.now() - t0}ms`);
			return result;
		})()
	]);

	console.log(`Total data fetch took ${performance.now() - start}ms`);

	return {
		stripeProducts,
		schoolWithAdmins,
		memberData
	};
};
