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
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	async function getDistricts() {
		return await db.select().from(table.districtsTable);
	}

	const form = await superValidate(zod(createSchoolSchema));

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
		// if (form.valid) {
		// 	// return fail(400, { form });
		// 	if (form.data.isDistrict) {
		// 		console.log('district form => ', form);
		// 		return message(form, 'District form');
		// 	}
		// 	console.log('school form => ', form);
		// 	return message(form, 'valid form'); // Will return fail(400, { form }) since form isn't valid
		// }

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

		let inviteToken: string = '';

		try {
			console.log('create form trying... ======================> ', form);
			const result = await db.transaction(async (trx) => {
				let schoolResult;
				if (!form.data.isDistrict) {
					schoolResult = await trx
						.insert(table.schoolsTable)
						.values({
							name: form.data.name ?? '',
							districtId: form.data.districtId,
							createdBy: event.locals.user?.id ?? ''
						})
						.returning();
					console.log('schoolResult => ', schoolResult);
				}

				let inviteData: {
					id: string;
					name: string;
					email: string;
					inviteType: 'district' | 'school';
					inviter: string;
					schoolId?: number;
					districtId?: number;
				} = {
					id: nanoid(),
					name: form.data.adminName,
					email: form.data.adminEmail,
					inviteType: form.data.isDistrict ? 'district' : 'school',
					inviter: event.locals.user?.id ?? ''
				};
				// create invite here, use it in invite page to...
				let inviteRes;
				if (!form.data.isDistrict && schoolResult && schoolResult.length > 0) {
					inviteRes = await trx
						.insert(table.userInvitesTable)
						.values({ ...inviteData, schoolId: schoolResult[0].id })
						.returning();
					inviteData.schoolId = schoolResult[0].id;
				} else {
					inviteRes = await trx
						.insert(table.userInvitesTable)
						.values({ ...inviteData, districtId: form.data.districtId })
						.returning();
					inviteData.districtId = form.data.districtId;
				}
				console.log('inviteRes => ', inviteRes);
				inviteToken = createInviteToken(form.data.adminName, form.data.adminEmail, inviteRes[0].id);

				if (!inviteRes) throw new Error('Failed to create invite');

				const [newUser] = await trx
					.insert(table.usersTable)
					.values({
						id: generateUserId(),
						username: form.data.adminEmail,
						name: form.data.adminName,
						role: form.data.isDistrict ? 'district_admin' : 'school_admin'
					})
					.returning({ id: table.usersTable.id });
				console.log('newUser => ', newUser);

				if (!newUser) throw new Error('Failed to create user');

				//associate user with school/district
				let adminRes;
				if (inviteRes[0].inviteType === 'school') {
					adminRes = await trx
						.insert(table.schoolAdminsTable)
						.values({ userId: newUser.id, schoolId: inviteRes[0].schoolId! })
						.returning({ id: table.schoolAdminsTable.id });
					console.log(`school adminRes=> `, adminRes[0]);
				} else if (inviteRes[0].inviteType === 'district') {
					adminRes = await trx
						.insert(table.districtAdminsTable)
						.values({ userId: newUser.id, districtId: inviteRes[0].districtId! })
						.returning({ id: table.districtAdminsTable.id });
					console.log('district adminRes => ', adminRes[0]);
				}
				if (!adminRes || !adminRes[0].id) throw new Error('Failed to associate admin');

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
	}
};
