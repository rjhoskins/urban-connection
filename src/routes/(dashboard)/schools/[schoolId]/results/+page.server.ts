import {
	getAllTimeQuestionResponsesByDomainForSchool,
	getAllTimeQuestionResponsesStatsByQuestionForSchool,
	getSchoolDetailsById
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	console.log('load hit ========================>', event.locals.user);
	if (!event.locals.user) throw redirect(302, '/auth/login');
	if (event.locals.user.role !== 'school_admin') throw redirect(302, '/auth/login');

	const schoolId = parseInt(event.params.schoolId);
	// if (isNaN(schoolId)) throw redirect(302, '/');
	return {
		schoolData: await getSchoolDetailsById(schoolId),
		domainData: await getAllTimeQuestionResponsesByDomainForSchool(schoolId),
		questionsData: await getAllTimeQuestionResponsesStatsByQuestionForSchool(schoolId)
	};
}) satisfies PageServerLoad;
