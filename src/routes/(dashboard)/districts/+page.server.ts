import type { PageServerLoad } from './$types';
import { getDistrictAdminsDistrictIdByUserId, getDistrictSurveyTotals } from '$lib/server/queries';
import { error, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	console.log('event.locals.user', event.locals.user);
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	if (event.locals.user.role === 'school_admin') {
		error(403, 'not authorized');
	}
	if (event.locals.user.role === 'district_admin') {
		// throw redirect(302, '/auth/login');
		const districtRes = await getDistrictAdminsDistrictIdByUserId(event.locals.user.id);
		console.log('districtId==========================================', districtRes?.id);
		if (!districtRes) {
			error(403, 'not authorized');
		}
		throw redirect(302, `districts/${districtRes.id}`);
	}

	return { districtsData: await getDistrictSurveyTotals() };
}) satisfies PageServerLoad;
