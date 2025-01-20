import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { message, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createNewUserFromInviteSchema } from '$lib/schema';
import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('inviteToken');

	const form = await superValidate(zod(createNewUserFromInviteSchema));

	return { form, token };
};

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event, zod(createNewUserFromInviteSchema));
		if (!form.valid) {
			return message(form, 'Invalid form');
		}

		const newUserId = generateUserId();
		const passwordHash = await hash(form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userEmail = form.data.email;

		const [existingUnusedInvite] = await db
			.select()
			.from(table.userInvitesTable)
			.where(
				and(eq(table.userInvitesTable.email, userEmail), eq(table.userInvitesTable.used, false))
			);

		if (!existingUnusedInvite) {
			return message(form, 'Invalid invite, please contact your administrator');
		}
		console.log('existingUnusedInvite => ', existingUnusedInvite);

		const [existingUser] = await db
			.select()
			.from(table.usersTable)
			.where(eq(table.usersTable.username, userEmail));

		if (existingUser) {
			return message(form, 'User already exists, please contact your administrator');
		}

		try {
			const result = await db.transaction(async (trx) => {
				const [newUser] = await trx
					.insert(table.usersTable)
					.values({ id: newUserId, username: userEmail, passwordHash, name: form.data.name })
					.returning({ id: table.usersTable.id });

				if (!newUser) throw new Error('Failed to create user');

				const [inviteRes] = await trx
					.update(table.userInvitesTable)
					.set({ used: true, invitee: newUser.id })
					.where(eq(table.userInvitesTable.email, userEmail))
					.returning();

				if (!inviteRes) throw new Error('Invite update failed');

				//associate user with school/district
				if (inviteRes.inviteType === 'school') {
					await trx
						.insert(table.schoolAdminsTable)
						.values({ userId: newUser.id, schoolId: inviteRes.schoolId! });
				} else if (inviteRes.inviteType === 'district') {
					await trx
						.insert(table.districtAdminsTable)
						.values({ userId: newUser.id, districtId: inviteRes.districtId! });
				}

				return newUser;
			});

			// Create session and set cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		return redirect(302, '/');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
