import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	// console.log('PageServerLoad event.locals.user.id => ', event.locals.user.id);
	const [user] = await db
		.select()
		.from(table.usersTable)
		.where(eq(table.usersTable.id, event.locals.user.id));
	// console.log('PageServerLoad user => ', user);

	// console.log('Loading PageServerLoaddata');
	return {
		// role: user.role
		// user: event.locals.user
	};
}) satisfies PageServerLoad;
