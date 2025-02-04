import { message, superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema, inviteNewUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { districts } from '$lib/data/data.js';
import { redirect } from '@sveltejs/kit';
import { createInviteToken, generateUserId } from '$lib/utils';
import { SERVER_ERROR_MESSAGES } from '$lib/constants.js';
import { nanoid } from 'nanoid';
import { setFlash } from 'sveltekit-flash-message/server';
import { eq, and } from 'drizzle-orm';
import { log } from 'console';

export const load: PageServerLoad = async (event) => {
	// console.log('PageServerLoad => ', event.locals.user);
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(inviteNewUserSchema));

	return { form };
};
export const actions: Actions = {
	default: async (event) => {
		console.log('aaaaand action!!! => ');
		if (!event.locals.user) return redirect(302, '/auth/login');
		// console.log('default => ', event.locals.user);

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Check the form and try again' }, event.cookies);
			return message(form, 'Invalid form');
		}

		const [loggedInUserRes] = await db
			.select()
			.from(table.usersTable)
			.where(eq(table.usersTable.id, event.locals.user.id));
		console.log('loggedInUserRes => ', loggedInUserRes);

		if (!loggedInUserRes) {
			setFlash({ type: 'error', message: 'Check the form and try again' }, event.cookies);
			return message(form, 'Invalid form');
		}
		const [existingUser] = await db
			.select()
			.from(table.usersTable)
			.where(eq(table.usersTable.username, form.data.email));

		if (existingUser) {
			setFlash(
				{ type: 'error', message: 'An admin already exists under this email, please check again.' },
				event.cookies
			);
			return message(form, 'User already exists, please contact your administrator');
		}

		let inviteToken = '';

		try {
			console.log('create form trying... ======================> ', form);
			const result = await db.transaction(async (trx) => {
				const [loggedInUsersSchoolRes] = await trx
					.select({ schoolId: table.schoolAdminsTable.schoolId })
					.from(table.schoolAdminsTable)
					.innerJoin(
						table.schoolsTable,
						eq(table.schoolsTable.id, table.schoolAdminsTable.schoolId)
					)
					.where(
						and(
							eq(table.schoolAdminsTable.userId, event.locals.user!.id),
							eq(table.schoolsTable.isActive, true)
						)
					);

				console.log('loggedInUsersSchoolRes => ', loggedInUsersSchoolRes);

				const [inviteRes] = await trx
					.insert(table.userInvitesTable)
					.values({
						id: nanoid(),
						name: form.data.name,
						email: form.data.email,
						schoolId: loggedInUsersSchoolRes.schoolId,
						inviter: event.locals.user?.id ?? '',
						isSent: true
					})
					.returning();

				console.log('inviteRes => ', inviteRes);
				if (!inviteRes) throw new Error('Failed to create invite');
				inviteToken = createInviteToken(form.data.name, form.data.email, inviteRes.id);

				const [newUser] = await trx
					.insert(table.usersTable)
					.values({
						id: generateUserId(),
						username: form.data.email,
						name: form.data.name
					})
					.returning({ id: table.usersTable.id });
				console.log('newUser => ', newUser);
				if (!newUser) throw new Error('Failed to create user');

				//associate user w/ same school
				const [newSchoolAdminRes] = await trx
					.insert(table.schoolAdminsTable)
					.values({ userId: newUser.id, schoolId: loggedInUsersSchoolRes.schoolId! })
					.returning();
				if (!newSchoolAdminRes) throw new Error('Failed to associate user with school');
				console.log('newSchoolAdminRes => ', newSchoolAdminRes);
				return newUser;
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
			console.log('error => ', form, 'Unexpected error: ' + errorMessage);
		}

		setFlash({ type: 'success', message: 'Invite successfully created' }, event.cookies);
		console.log('register => ', `/auth/register?inviteToken=${inviteToken}`);

		return redirect(302, '/');
	}
};

function createCoadminInvite() {}
