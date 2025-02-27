import { getLoggedInSchoolAdminsSchool } from '$lib/server/queries';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
	// await generateQuestionnaire();

	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	const { user } = event.locals;
	return {
		loggedInAdminSchool: (await getLoggedInSchoolAdminsSchool(user.id)) || null
	};
}) satisfies PageServerLoad;
