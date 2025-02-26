import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	setSurveyStatus
} from '$lib/server/queries';
import {
	type CreateDemographicsResponseInput,
	parseAndTransformCreateDemographicsData
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
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const { assessmentToken, subjectTaught, yearsTeaching, ...assessmentData } = data;
		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);
		const { name, email, surveyId, schoolId } = decodedeAssessmentToken;

		console.log('here ====> ');
		const demosParseResult = parseAndTransformCreateDemographicsData.safeParse({
			yearsTeaching: parseInt(String(yearsTeaching))!,
			schoolId: parseInt(String(schoolId))!,
			surveyId: parseInt(String(surveyId))!,
			subjectTaught: String(subjectTaught)
		});

		console.log('here ====> ');
		if (!demosParseResult.success) {
			console.log('here ====> ');

			console.error('Demographics data validation failed:', demosParseResult.error);
			return { success: false, data: data };
		}
		const parseAndCheckedDemographicsResponse =
			demosParseResult.data as unknown as CreateDemographicsResponseInput;
		console.log('parseAndCheckedDemographicsResponse ====> ', parseAndCheckedDemographicsResponse);
		const transformedSurveyQuestionsResponses = transformSurveyQuestionsResponses({
			surveyId: parseInt(surveyId),
			...data
		});

		try {
			console.log(
				'doing it with ====> ',
				parseAndCheckedDemographicsResponse,
				transformedSurveyQuestionsResponses
			);
			await addDemographicsData(parseAndCheckedDemographicsResponse);
			await addQuestionsData(transformedSurveyQuestionsResponses);
			await setSurveyStatus({ surveyId: parseInt(surveyId), status: 'completed' });
		} catch (error) {
			console.error('Database update failed:', error);
			setFlash(
				{ type: 'error', message: 'Unexpected error submitting survey, please try again.' },
				event.cookies
			);
		} finally {
			setFlash({ type: 'success', message: 'Survy Completed Thank you!' }, event.cookies);
			throw redirect(303, '/thank-you');
		}
	}
};
