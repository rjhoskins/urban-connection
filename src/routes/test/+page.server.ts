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
import { redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export async function load(event) {
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
	submit: async (event) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;

		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

		const { name, email, surveyId, schoolId } = decodedeAssessmentToken;

		if (data.demographics) {
			const parseResult = createSurveyDemographicsResponseSchema.safeParse(data);
			if (!parseResult.success) return { success: false, data: data };
			const demographicsResponse: CreateDemographicsResponseInput = parseResult.data;
			console.log('demographicsResponse => ', demographicsResponse);
			console.log('create  => ', {
				schoolId: parseInt(String(schoolId))!,
				surveyId: parseInt(String(surveyId))!,
				subjectTaught: demographicsResponse.subjectTaught ?? null,
				yearsTeaching: demographicsResponse?.yearsTeaching! ?? null
			});
			const newDemographicsEntry: CreateDemographicsResponseInput = {
				schoolId: parseInt(String(schoolId))!,
				surveyId: parseInt(String(surveyId))!,
				subjectTaught: demographicsResponse.subjectTaught ?? null,
				yearsTeaching: demographicsResponse.yearsTeaching ?? null
			};
			console.log('create newDemographicsEntry => ', newDemographicsEntry);
			// addDemographicsData(newDemographicsEntry);
			return { success: true, data };
		}

		// survey questions
		//check all anwered
		const dataArr = Object.keys(data);
		const numAnswered = dataArr.filter((el) => el.includes('qId'));
		if (data.isFirstQuestion) {
			console.log('isFirstQuestion');
			// set status to started
			setSurveyStatus({ surveyId: parseInt(surveyId), status: 'started' });
		}

		if (Number(data.totalQuestions) === numAnswered.length) {
			const transformedSurveyQuestionsResponses = transformSurveyQuestionsResponses({
				surveyId: parseInt(surveyId),
				...data
			});
			console.log('transformedSurveyQuestionsResponses => ', transformedSurveyQuestionsResponses);
			// addQuestionsData(transformedSurveyQuestionsResponses as CreateQuestionResponseInput);
		} else {
			// do nothing
			console.log('NOT all answered - do nothing');
		}
		if (data.isLastQuestion) {
			console.log('isLastQuestion');
			//set status to started
			setSurveyStatus({ surveyId: parseInt(surveyId), status: 'completed' });
			setFlash({ type: 'success', message: 'Survy Completed Thank you!' }, event.cookies);
			throw redirect(303, '/thank-you');
		}
	}
};
