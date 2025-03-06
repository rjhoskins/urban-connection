import { getLoggedInSchoolAdminsSchool } from '$lib/server/queries';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
	// await generateQuestionnaire();

	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	const { user } = event.locals;
	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	if (event.locals.user.role !== 'district_admin') {
		dataFunc = async () => getLoggedInSchoolAdminsSchool(user.id);
	}

	console.log('getLoggedInSchoolAdminsSchool', await getLoggedInSchoolAdminsSchool(user.id));

	return {
		data: await dataFunc()
	};
}) satisfies PageServerLoad;
