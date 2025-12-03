/** @type {import('./$types').PageServerLoad} */
import { error, redirect } from '@sveltejs/kit';
import {} from '$lib/server/queries';

export const load = async (event) => {
	console.log('Loading member-data page.server.ts');
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	console.log('User role:', event.locals.user.role);
	if (event.locals.user.role === 'school_admin') {
		throw error(403, 'Forbidden');
	}
	const { parent } = event;
	const parentData = await parent();

	return {
		...parentData
	};
};
