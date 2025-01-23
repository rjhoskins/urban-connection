import type { PageServerLoad } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
	// setFlash({ type: 'success', message: 'Please enter text.' }, event.cookies);
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
}) satisfies PageServerLoad;
