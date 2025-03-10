import { message, superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema, inviteNewUserSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	createAdminUserInviteToken,
	generateUserId,
	handleLogFlashReturnFormError
} from '$lib/utils';
import { nanoid } from 'nanoid';
import { setFlash } from 'sveltekit-flash-message/server';
import { eq, and } from 'drizzle-orm';
import { users, schoolAdmins, adminUserInvites, schools } from '$lib/server/db/schema';
import db from '$lib/server/db/index.js';

export const load: PageServerLoad = async (event) => {
	console.log('invite-coadmin PageServerLoad => ', event.locals.user);
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
		console.log('default => ', event.locals.user);

		const form = await superValidate(event, zod(inviteNewUserSchema));

		if (!form.valid) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}
		const schoolId = parseInt(event.params.schoolId);
		console.log('schoolId => ', schoolId);

		const [existingUser] = await db.select().from(users).where(eq(users.username, form.data.email));

		if (existingUser) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'User already exists, please contact your administrator',
				status: 400,
				event
			});
		}

		let inviteToken = '';

		try {
			const result = await db.transaction(async (trx) => {
				const [inviteRes] = await trx
					.insert(adminUserInvites)
					.values({
						id: nanoid(),
						name: form.data.name,
						email: form.data.email,
						schoolId: schoolId,
						inviter: event.locals.user?.id ?? '',
						isSent: true
					})
					.returning();

				if (!inviteRes) throw new Error('Failed to create invite');
				inviteToken = createAdminUserInviteToken(form.data.name, form.data.email, inviteRes.id);

				const [newUser] = await trx
					.insert(users)
					.values({
						id: generateUserId(),
						username: form.data.email,
						name: form.data.name,
						phone: form.data.phone
					})
					.returning({ id: users.id });
				console.log('newUser => ', newUser);
				if (!newUser) throw new Error('Failed to create user');

				//associate user w/ same school
				const [newSchoolAdminRes] = await trx
					.insert(schoolAdmins)
					.values({ userId: newUser.id, schoolId })
					.returning();
				if (!newSchoolAdminRes) throw new Error('Failed to associate user with school');
				console.log('newSchoolAdminRes => ', newSchoolAdminRes);
				// throw new Error('testing error');
				return newUser;
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
			console.log('error => ', form, 'Unexpected error: ' + errorMessage);
		}

		const registerLink = `/auth/register?inviteToken=${inviteToken}`;
		setFlash(
			{
				type: 'success',
				message: `Invite successfully created \n  ${registerLink}`
			},
			event.cookies
		);

		console.log('register =>', `/auth/register?inviteToken=${inviteToken}`);

		return redirect(302, './');
	}
};

function createCoadminInvite() {}
