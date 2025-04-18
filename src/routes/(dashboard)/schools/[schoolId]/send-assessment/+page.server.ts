import { superValidate } from 'sveltekit-superforms/server';
import { sendAssessmentInviteSchem } from '$lib/schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types.js';
import { createAssessmentInviteToken, handleLogFlashReturnFormError } from '$lib/utils.js';
import { setFlash } from 'sveltekit-flash-message/server';
import { redirect } from '@sveltejs/kit';
import { createAssessment, getLatestHtmlTemplateDataByType } from '$lib/server/queries';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(sendAssessmentInviteSchem));

	return {
		form,
		assessmentInviteHtmlTemplate: await getLatestHtmlTemplateDataByType('assessment_invite')
	};
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

		let assessmentId;
		try {
			const assessmentInviteHtmlTemplate =
				await getLatestHtmlTemplateDataByType('assessment_invite');
			if (!assessmentInviteHtmlTemplate) {
				throw new Error('No assessment invite template found');
			}
			// create assessment
			assessmentId = await createAssessment({
				participantName: form.data.name,
				participantEmail: form.data.email,
				schoolId: parseInt(event.params.schoolId),
				sentBy: event.locals.user.id
			});

			const assessmentToken = createAssessmentInviteToken({
				sentBy: event.locals.user.id,
				schoolId: parseInt(event.params.schoolId)
			});

			const inviteLink = `${event.url.origin}/urban-connection-project-assessment?assessmentToken=${assessmentToken}`;
			console.log(`inviteLink => , ${inviteLink}`);

			const res = await event.fetch('/api/send-assessment-invite', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					to: form.data.email,
					subject: 'You have been invited to take an assessment',
					inviteLink,
					htmlEmailContent: assessmentInviteHtmlTemplate?.template
				})
			});
			if (!res.ok) {
				const errorMessage = await res.text();
				throw new Error(`Failed to send email: ${errorMessage}`);
			}
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
			assessmentId: assessmentId!.id,
			schoolId: parseInt(event.params.schoolId)
		});
		console.log(`assessmentToken => , ${assessmentToken}`);
		setFlash({ type: 'success', message: 'Assessment invite sent' }, event.cookies);

		redirect(303, './');
	}
};
