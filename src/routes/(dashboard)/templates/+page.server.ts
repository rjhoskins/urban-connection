import { getHtmlTemplateTypes } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	if (event.locals.user?.role !== 'super_admin') {
		return {
			status: 403,
			error: new Error('Forbidden')
		};
	}
	return {
		templateTypes: await getHtmlTemplateTypes()
	};
}) satisfies PageServerLoad;
