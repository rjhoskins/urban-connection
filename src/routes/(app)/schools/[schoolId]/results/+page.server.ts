import {
	getAllTimeQuestionResponsesByDomainForSchool,
	getAllTimeQuestionResponsesStatsByQuestionForSchool,
	getSchoolDetailsById
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logIfDev } from '$lib/utils';
import { error } from 'console';

export const load = (async (event) => {
	logIfDev('results load hit ========================>', event.locals.user);
	const schoolId = event.params.schoolId;

	if (!event.locals.user) throw redirect(302, '/auth/login');
	const schoolData = await getSchoolDetailsById(schoolId);

	if (!schoolData) throw error(404, 'School not found');

	return {
		schoolData,
		domainData: await getAllTimeQuestionResponsesByDomainForSchool(schoolId),
		questionsData: await getAllTimeQuestionResponsesStatsByQuestionForSchool(schoolId)
	};
}) satisfies PageServerLoad;
