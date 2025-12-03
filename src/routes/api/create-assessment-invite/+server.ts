import { createAssessmentInvite } from '$lib/server/queries';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const res = await event.request.json();
	console.log('POST /api/create-assessment-invite============> ', res);
	console.log('POST LOCALS', event.locals);
	const newAssessmentInvite = await createAssessmentInvite({
		schoolId: res.schoolId,
		createdBy: res.createdBy
	});

	if (event.locals.user?.id !== res.createdBy) {
		return json({ success: false, message: 'Unauthorized' }, { status: 401 });
	}

	return json({ success: true, data: newAssessmentInvite });
};
