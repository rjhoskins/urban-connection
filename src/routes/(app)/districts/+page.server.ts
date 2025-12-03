import type { PageServerLoad } from './$types';
import {
	getDistrictAdminsDistrictIdByUserId,
	getDistrictAssessmentTotals,
	getLoggedInSuperAdminsDistrict
} from '$lib/server/queries';
import { error, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	if (event.locals.user.role === 'school_admin') {
		error(403, 'not authorized');
	}

	console.log('super admin/district admin dashboard load');
	let districts;

	if (event.locals.user.role === 'district_admin') {
		// throw redirect(302, '/auth/login');
		districts = await getDistrictAdminsDistrictIdByUserId(event.locals.user.id);
		// console.log('districtId========================', districts?.id);
		if (!districts) error(403, 'not authorized');
		if (event.url.searchParams.get('view') === 'results') {
			throw redirect(302, `districts/${districts.districtId}/results`);
		}
		if (!districts) error(403, 'not authorized');
		return redirect(302, `districts/${districts.districtId}`);
	}
	if (event.locals.user.role === 'super_admin') {
		// throw redirect(302, '/auth/login');
		districts = await getLoggedInSuperAdminsDistrict();
		// console.log('districtId========================', districts?.id);
		// if (!districts) error(403, 'not authorized');
		// if (event.url.searchParams.get('view') === 'results') {
		// 	throw redirect(302, `districts/${districts.districtId}/results`);
		// }
		// throw redirect(302, `districts/${districts.districtId}`);
	}

	return { districts };
}) satisfies PageServerLoad;
