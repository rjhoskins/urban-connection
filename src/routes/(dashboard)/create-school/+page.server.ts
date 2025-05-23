import { superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	createAdminUserInviteToken,
	generateUserId,
	handleLogFlashReturnFormError
} from '$lib/utils';
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
} from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals, parent }) => {
	if (!locals.user) return redirect(302, '/auth/login');
	const user = locals.user;
	if (!user) return fail(400, { message: 'User not authenticated' });

	const form = await superValidate(zod(createSchoolSchema));
	const parentData = await parent();

	return {
		districts: await getDistricts(),
		form,
		pageTitle: parentData.pageTitle
	};
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return redirect(302, '/auth/login');

		const form = await superValidate(event, zod(createSchoolSchema));

		let inviteToken: string = '';
		try {
			if (!form.valid) {
				return handleLogFlashReturnFormError({
					type: 'error',
					form,
					message: 'Invalid form',
					status: 400,
					event
				});
			}

			//testing
			// await new Promise((resolve) => setTimeout(resolve, 3000));
			// return { success: true, message: 'testing... success' };
			// throw new Error(testing...');

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

			console.log('', form);
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

				inviteToken = createAdminUserInviteToken(
					form.data.adminName,
					form.data.adminEmail,
					inviteRes.id
				);
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
				// throw new Error('testing error');

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

		setFlash(
			{
				type: 'success',
				message: `School successfully created, now invite ${form.data.adminName} to join the school`
			},
			event.cookies
		);
		console.log(
			'school admin invite token => ',
			`${event.url.origin}/auth/register?inviteToken=${inviteToken}`
		);

		redirect(303, `/schools/invite?inviteToken=${inviteToken}`);
	}
};
