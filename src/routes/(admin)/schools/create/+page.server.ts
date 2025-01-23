import { message, superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema } from '$lib/schema';
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
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	async function getDistricts() {
		return await db.select().from(table.districtsTable);
	}
	// console.log('PageServerLoad ======================================================>');

	const form = await superValidate(zod(createSchoolSchema));
	// console.log('form => ', form);

	// Always return { form } in load functions https://superforms.rocks/faq#why-do-i-need-to-call-supervalidate-in-the-load-function

	return {
		districts: await getDistricts(),
		form
	};
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');

		const form = await superValidate(event, zod(createSchoolSchema));

		if (!form.valid) {
			// return fail(400, { form });
			return message(form, 'Invalid form'); // Will return fail(400, { form }) since form isn't valid
		}

		const [existingUser] = await db
			.select()
			.from(table.usersTable)
			.where(eq(table.usersTable.username, form.data.adminEmail));

		if (existingUser) {
			setFlash(
				{ type: 'error', message: 'An admin already exists under this email, please check again.' },
				event.cookies
			);
			return message(form, 'User already exists, please contact your administrator');
		}

		let inviteToken: string;

		try {
			console.log('create form trying... => ', form);
			const result = await db.transaction(async (trx) => {
				const [schoolResult] = await trx
					.insert(table.schoolsTable)
					.values({
						name: form.data.name,
						districtID: form.data.districtId,
						createdBy: event.locals.user?.id ?? ''
					})
					.returning();
				console.log('schoolResult => ', schoolResult);

				// create invite here, use it in invite page to...
				const [inviteRes] = await trx
					.insert(table.userInvitesTable)
					.values({
						id: nanoid(),
						name: form.data.adminName,
						email: form.data.adminEmail,
						schoolId: schoolResult.id as number,
						inviter: event.locals.user?.id ?? ''
					})
					.returning();
				console.log('inviteRes => ', inviteRes);
				inviteToken = createInviteToken(form.data.adminName, form.data.adminEmail, inviteRes.id);

				if (!inviteRes) throw new Error('Failed to create invite');

				const [newUser] = await trx
					.insert(table.usersTable)
					.values({
						id: generateUserId(),
						username: form.data.adminEmail,
						name: form.data.adminName
					})
					.returning({ id: table.usersTable.id });

				if (!newUser) throw new Error('Failed to create user');

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
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
		}

		setFlash({ type: 'success', message: 'School successfully created' }, event.cookies);
		console.log('inviteToken => ', inviteToken);

		redirect(303, `/schools/invite?inviteToken=${inviteToken}`);
		return redirect(302, '/');
	}
};
