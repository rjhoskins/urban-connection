import {
	getAllTimeQuestionResponsesByDomainForDistrict,
	getAllTimeQuestionResponsesStatsByQuestionForDistrict,
	getDistrictDetailsById
} from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	if (!event.locals.user) throw redirect(302, '/auth/login');
	if (event.locals.user.role === 'school_admin') throw redirect(302, '/auth/login');

	const districtId = event.params.districtId;
	if (!districtId) throw redirect(302, '/dashboard');
	return {
		districtData: await getDistrictDetailsById(districtId),
		domainData: await getAllTimeQuestionResponsesByDomainForDistrict(districtId),
		questionsData: await getAllTimeQuestionResponsesStatsByQuestionForDistrict(districtId)
	};
}) satisfies PageServerLoad;
