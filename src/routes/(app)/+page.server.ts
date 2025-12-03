import {
	getLoggedInDistrictAdminsDistrict,
	getLoggedInSchoolAdminsSchool,
	getLoggedInSuperAdminsDistrict
} from '$lib/server/queries';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
	// await generateQuestionnaire();

	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	const { user } = event.locals;
	console.log('dashboard load for user => ', user);
	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	if (event.locals.user.role === 'school_admin') {
		dataFunc = async () => getLoggedInSchoolAdminsSchool(user.id);
	}
	if (event.locals.user.role === 'district_admin') {
		console.log('district admin load');
		dataFunc = async () => getLoggedInDistrictAdminsDistrict(user.id);
	}
	if (event.locals.user.role === 'super_admin') {
		console.log('super admin load');
		dataFunc = async () => getLoggedInSuperAdminsDistrict();
	}

	return {
		data: await dataFunc()
	};
}) satisfies PageServerLoad;
