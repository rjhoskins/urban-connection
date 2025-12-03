import { createNewUserFromInviteSchema } from '$lib/schema';
import * as auth from '$lib/server/auth';
import * as table from '$lib/server/db/schema/db-utils';
import { hash } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '../$types';

import { setFlash } from 'sveltekit-flash-message/server';
import { simpleRegisterToBeDEPRICATED } from '$lib/server/queries';

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event, zod(createNewUserFromInviteSchema));
		if (!form.valid) {
			return message(form, 'Invalid form');
		}

		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const res = await simpleRegisterToBeDEPRICATED({
				passwordHash,
				username: form.data.username
			});

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		return redirect(302, '/');
	}
};
