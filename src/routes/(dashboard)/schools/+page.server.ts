/** @type {import('./$types').PageServerLoad} */

import { error, redirect, type Actions } from '@sveltejs/kit';
import {
	getSchoolIDForSchoolAdmin,
	getSchoolsForDistrictAdmin,
	getSchoolsWithSurveyCountAndScoreData
} from '$lib/server/queries';

export const load = async (event) => {
	const { parent } = event;
	if (!event.locals.user?.id) {
		return redirect(302, '/auth/login');
	}

	let data: any = [];
	switch (event.locals.user.role) {
		case 'school_admin': {
			const schoolId = await getSchoolIDForSchoolAdmin(event.locals.user.id);
			if (!schoolId) error(403, 'not authorized');
			if (event.url.searchParams.get('view') === 'results') {
				throw redirect(302, `schools/${schoolId}/results`);
			} else return redirect(302, `/schools/${schoolId}`);
		}
		case 'super_admin': {
			data = await getSchoolsWithSurveyCountAndScoreData();
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
		schools: data
	};
};

export const actions: Actions = {
	default: async (event) => {
		console.log('default event => ', event);
		// if (!form.valid) {
		// 	return message(form, 'Invalid form');
		// }
		console.log('form => ');
		// return form;
	}
};
