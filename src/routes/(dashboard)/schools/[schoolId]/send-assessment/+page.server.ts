import { message, superValidate } from 'sveltekit-superforms/server';
import { sendAssessmentInviteSchem } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { createAssessmentInviteToken, handleLogFlashReturnFormError } from '$lib/utils.js';
import { setFlash } from 'sveltekit-flash-message/server';
import { redirect } from '@sveltejs/kit';
import { createAssessment } from '$lib/server/queries.js';
import { string } from 'zod';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(sendAssessmentInviteSchem));

	return { form };
};
export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) redirect(303, '/auth/login');

		const form = await superValidate(event, zod(sendAssessmentInviteSchem));

		if (!form.valid) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'invalid form data',
				status: 400,
				event
			});
		}

		let surveyId;
		try {
			// create survey
			surveyId = await createAssessment({
				recipientName: form.data.name,
				recipientEmail: form.data.email,
				schoolId: parseInt(event.params.schoolId),
				sentBy: event.locals.user.id
			});
		} catch (error) {
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Error sending assessment invite',
				status: 500,
				event
			});
			redirect(303, './');
		}
		const assessmentToken = createAssessmentInviteToken({
			name: form.data.name,
			email: form.data.email,
			surveyId: surveyId!.id,
			schoolId: parseInt(event.params.schoolId)
		});
		console.log(`assessmentToken => , ${assessmentToken}`);

		setFlash(
			{
				type: 'success',
				message: 'Assessment invite sent=>\n' + `/test?assessmentToken=${assessmentToken}`
			},
			event.cookies
		);
		redirect(303, './');
	}
};
