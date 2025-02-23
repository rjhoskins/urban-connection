import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	setSurveyStatus
} from '$lib/server/queries';
import demographicsSchema, {
	createSurveyDemographicsResponseSchema,
	type CreateDemographicsResponseInput,
	type CreateQuestionResponseInput
} from '$lib/types/survey';
import { decodeAssessmentInviteToken, transformSurveyQuestionsResponses } from '$lib/utils.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	const assessmentToken = await event.url.searchParams.get('assessmentToken');
	const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);
	const { name, email, surveyId, schoolId } = decodedeAssessmentToken;

	// console.log(`load Token===== name `, name);
	// console.log(`load Token===== email `, email);
	// console.log(`load Token===== surveyId `, parseInt(surveyId));
	// console.log(`load Token===== schoolId `, parseInt(schoolId));

	return {
		assessmentToken,
		surveyData: await generateQuestionnaire()
	};
}

export const actions = {
	submit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		// console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;

		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

		const { name, email, surveyId, schoolId } = decodedeAssessmentToken;

		if (data.demographics) {
			const parseResult = createSurveyDemographicsResponseSchema.safeParse({
				...data,
				schoolId: parseInt(String(schoolId))!,
				surveyId: parseInt(String(surveyId))!
			});
			if (!parseResult.success) return { success: false, data: data };
			const parseAndCheckedDemographicsResponse: CreateDemographicsResponseInput = parseResult.data;
			addDemographicsData(parseAndCheckedDemographicsResponse);
			return { success: true, data };
		}

		// survey questions
		if (data.isFirstQuestion) {
			setSurveyStatus({ surveyId: parseInt(surveyId), status: 'started' });
		}

		const transformedSurveyQuestionsResponses = transformSurveyQuestionsResponses({
			surveyId: parseInt(surveyId),
			...data
		});

		addQuestionsData(transformedSurveyQuestionsResponses as CreateQuestionResponseInput);

		if (data.isLastQuestion) {
			setSurveyStatus({ surveyId: parseInt(surveyId), status: 'completed' });
			setFlash({ type: 'success', message: 'Survy Completed Thank you!' }, event.cookies);
			throw redirect(303, '/thank-you');
		}
	}
};
