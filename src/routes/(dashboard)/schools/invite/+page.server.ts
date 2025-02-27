import { getLoggedInSchoolAdminsSchool } from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	const userSchoolId = (await getLoggedInSchoolAdminsSchool(event.locals.user.id))?.id ?? 0;
	if (userSchoolId === 0) throw redirect(302, '/auth/login');
	return redirect(302, `/schools/${userSchoolId}/send-assessment`);
}) satisfies PageServerLoad;
