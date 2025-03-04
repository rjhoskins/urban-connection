/** @type {import('./$types').PageServerLoad} */
// import { schools } from '$lib/data/data';

import * as table from '$lib/server/db/schema/db-utils';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import {
	getSchoolAdmin,
	getSchoolForDistrictAdmin,
	getSchoolForSchoolAdmin,
	getSchoolForSuperAdmin
} from '$lib/server/queries';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	if (event.locals.user && event.locals.user.role === 'school_admin') {
		console.log('school_admin user =======================> ');
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForSchoolAdmin(userId, Number(event.params.schoolId));
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(Number(event.params.schoolId));
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		dataFunc = () => getSchoolForSuperAdmin(Number(event.params.schoolId));
		adminDataFunc = async () => getSchoolAdminBySchoolId(Number(event.params.schoolId));
		// adminDataFunc = async () => {
		// 	if (event.locals.user) {
		// 		return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
		// 	}
		// 	return null;
		// };
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc()
	};
};
