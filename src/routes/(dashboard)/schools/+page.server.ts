/** @type {import('./$types').PageServerLoad} */

import { redirect, type Actions } from '@sveltejs/kit';
import {
	getSchoolIDForSchoolAdmin,
	getSchoolsForDistrictAdmin,
	getSchoolsForSuperAdmin
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
			console.log('school_admin user REDIRECT => ', event.locals.user);
			return redirect(302, `/schools/${schoolId}`);
		}
		case 'super_admin': {
			data = await getSchoolsForSuperAdmin();
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
