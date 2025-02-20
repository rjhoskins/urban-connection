import { message, superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createInviteToken, generateUserId, handleLogFlashReturnFormError } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import db from '$lib/server/db/index.js';
import {
	createSchool,
	createAdminUserInvite,
	createNewUserWithDetails,
	createSchoolAdmin,
	createDistrictAdmin,
	getDistricts,
	checkAdminUserExists
} from '$lib/server/queries.js';
import { check } from 'drizzle-orm/mysql-core';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/auth/login');
	const user = event.locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(createSchoolSchema));

	// Always return { form } in load functions https://superforms.rocks/faq#why-do-i-need-to-call-supervalidate-in-the-load-function

	return {
		districts: await getDistricts(),
		form
	};
};
export const actions: Actions = {
	default: async (event) => {
		console.log('here 1 ======================================================> ');
		if (!event.locals.user) return redirect(302, '/auth/login');

		const form = await superValidate(event, zod(createSchoolSchema));
		if (!form.valid) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}

		const existingUser = await checkAdminUserExists({ username: form.data.adminEmail });
		if (existingUser) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'User already exists, please contact your administrator',
				status: 400,
				event
			});
		}
		console.log('existingUser => ', existingUser);

		let inviteToken: string = '';
		try {
			console.log('create form trying... ======================> ', form);
			const result = await db.transaction(async (trx) => {
				let schoolResult;
				if (!form.data.isDistrict) {
					schoolResult = await createSchool(
						{
							name: form.data.name ?? '',
							districtId: form.data.districtId,
							createdBy: event.locals.user?.id ?? ''
						},
						trx
					);

					console.log('schoolResult => ', schoolResult);
				}

				let inviteRes = await createAdminUserInvite(
					{
						inviteData: {
							id: generateUserId(),
							name: form.data.adminName,
							email: form.data.adminEmail,
							inviteType: form.data.isDistrict ? 'district' : 'school',
							inviter: event.locals.user?.id ?? '',
							schoolId: schoolResult?.id ?? null,
							districtId: form.data.districtId ?? null
						}
					},
					trx
				);
				if (!inviteRes) throw new Error('Failed to create invite');

				console.log('inviteRes => ', inviteRes);
				inviteToken = createInviteToken(form.data.adminName, form.data.adminEmail, inviteRes.id);
				const newUser = await createNewUserWithDetails(
					{
						id: generateUserId(),
						username: form.data.adminEmail,
						name: form.data.adminName,
						role: form.data.isDistrict ? 'district_admin' : 'school_admin',
						phone: form.data.adminPhone ? form.data.adminPhone : ''
					},
					trx
				);
				if (!newUser) {
					throw new Error('Failed to create user');
				}

				//associate user with school/district
				let adminRes;
				if (inviteRes.inviteType === 'school') {
					adminRes = await createSchoolAdmin(
						{ userId: newUser.id, schoolId: inviteRes.schoolId! },
						trx
					);

					console.log(`school adminRes=> `, adminRes);
				} else if (inviteRes.inviteType === 'district') {
					adminRes = await createDistrictAdmin(
						{ userId: newUser.id, districtId: inviteRes.districtId! },
						trx
					);
					console.log('district adminRes => ', adminRes);
				}
				if (!adminRes) {
					throw new Error('Failed to associate admin');
				}

				return newUser;
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: errorMessage,
				status: 500,
				event
			});
		}

		setFlash({ type: 'success', message: 'School successfully created' }, event.cookies);
		console.log('inviteToken => ', inviteToken);
		redirect(303, `/schools/invite?inviteToken=${inviteToken}`);
	}
};
