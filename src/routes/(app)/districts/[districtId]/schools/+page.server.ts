/** @type {import('./$types').PageServerLoad} */

import { error, redirect, type Actions } from '@sveltejs/kit';
import {
	getSchoolsForDistrictAdmin,
	getSchoolsWithAssessmentCountAndScoreData
} from '$lib/server/queries';

export const load = async (event) => {
	const { parent } = event;
	if (!event.locals.user?.id) {
		return redirect(302, '/auth/login');
	}
	if (event.locals.user.role === 'school_admin') {
		throw error(403, 'Access denied');
	}

	let data: any = [];
	switch (event.locals.user.role) {
		case 'super_admin': {
			data = await getSchoolsWithAssessmentCountAndScoreData();
			break;
		}
		case 'district_admin': {
			data = await getSchoolsForDistrictAdmin(event.locals.user.id);
			break;
		}
		default:
			console.log('Unhandled role:', event.locals.user.role);
			break;
	}
	const parentData = await parent();

	return {
		user: event.locals.user,
		schools: data,
		pageTitle: 'Manage Schools'
	};
};
