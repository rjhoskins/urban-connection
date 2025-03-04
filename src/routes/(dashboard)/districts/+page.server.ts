import type { PageServerLoad } from './$types';
import { getDistrictSurveyTotals } from '$lib/server/queries';

export const load = (async () => {
	return { districtsData: await getDistrictSurveyTotals() };
}) satisfies PageServerLoad;
