/** @type {import('./$types').PageServerLoad} */

import { error, json, redirect, type Actions } from '@sveltejs/kit';
import {
	getSchoolsForDistrictAdmin,
	getSchoolsWithAssessmentCountAndScoreData,
	getSchoolByAdminId
} from '$lib/server/queries';

export const load = async (event) => {
	const { parent } = event;
	if (!event.locals.user?.id) {
		return redirect(302, '/auth/login');
	}

	let data: any = [];
	let schoolResult: {
		id: string;
	} | null = null;
	switch (event.locals.user.role) {
		case 'school_admin': {
			console.log('school admin!!!!!!!!!!!!!!!!!!!!!!!!!!====================');
			schoolResult = await getSchoolByAdminId({ userId: event.locals.user.id });
			if (!schoolResult) error(403, 'not authorized');
			redirect(302, `/schools/${schoolResult.id}`);
			//TODO: if menu expanded, redirect to appropriate page
			// if (event.url.searchParams.get('view') === 'invite') {
			// 	console.log('redirecting to invite-coadmin ===============>');
			// 	throw redirect(302, `schools/${schoolPublicId}/invite-coadmin`);
			// }
			// if (event.url.searchParams.get('view') === 'assessment') {
			// 	console.log('redirecting to invite-coadmin ===============>');
			// 	throw redirect(302, `/schools/${schoolPublicId}/send-assessment`);
			// }
			// if (event.url.searchParams.get('view') === 'invite') {
			// 	console.log('redirecting to invite-coadmin ===============>');
			// 	throw redirect(302, `schools/${schoolPublicId}/invite-coadmin`);
			// }
			// if (event.url.searchParams.get('view') === 'results') {
			// 	console.log('herez ===============>');
			// 	throw redirect(302, `schools/${schoolPublicId}/results`);
			// } else {
			// 	console.log('herez ===============> 2');
			// 	throw redirect(302, `schools/${schoolPublicId}`);
			// }
		}
		case 'super_admin': {
			data = await getSchoolsWithAssessmentCountAndScoreData();
			break;
		}
		case 'district_admin': {
			data = await getSchoolsForDistrictAdmin(event.locals.user.id);
			break;
		}
		default:
			console.log('Unhandled role:', event.locals.user.role);
			break;
	}
	const parentData = await parent();

	return {
		user: event.locals.user,
		schools: data,
		pageTitle: 'Manage Schools'
	};
};

export const actions = {
	'create-assessment-invite': async ({ cookies, request, locals }) => {
		const { createdBy, schoolId } = await request.json();
		console.log('login action called with ', { createdBy, schoolId });
		console.log('actions LOCALS', locals);

		if (locals.user?.id !== createdBy) {
			return error(401, 'Unauthorized');
		}

		// return json({ success: true, data: newAssessmentInvite });
		return json({ success: true });
	}
} satisfies Actions;
