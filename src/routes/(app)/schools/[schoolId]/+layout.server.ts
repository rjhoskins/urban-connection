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

	const start = performance.now();
	const [stripeProducts, schoolWithAdmins, memberData] = await Promise.all([
		(async () => {
			const t0 = performance.now();
			const result = await stripe.products.list({
				expand: ['data.default_price']
			});
			const safeProducts = result.data.map((product) => {
				return {
					name: product.name,
					description: product.description,
					key:
						typeof product.default_price === 'object'
							? product.default_price?.lookup_key
							: undefined
				};
			});

			console.log(`===stripe products===:`, safeProducts);

			console.log(`Stripe products fetch took ${performance.now() - t0}ms`);
			return safeProducts;
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
async function getProductsByLookupKey(lookupKey: string) {
	// First, find all prices with this lookup key
	const prices = await stripe.prices.list({
		lookup_keys: [lookupKey],
		active: true,
		expand: ['data.product']
	});
}
