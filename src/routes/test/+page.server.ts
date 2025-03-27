import { demographicsData } from '$lib/constants.js';
import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	getSurveyById,
	setSurveyStatus
} from '$lib/server/queries';
import {
	type CreateDemographicsResponseInput,
	parseAndTransformCreateDemographicsData
} from '$lib/types/survey';
import { decodeAssessmentInviteToken, transformSurveyQuestionsResponses } from '$lib/utils.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { is } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { message } from 'sveltekit-superforms';

export async function load(event: RequestEvent) {
	const assessmentToken = await event.url.searchParams.get('assessmentToken');
	const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);
	const { name, email, surveyId, schoolId } = decodedeAssessmentToken;
	let assessmentProgress = [];

	const currAssessment = await getSurveyById(parseInt(surveyId));
	if (!currAssessment) {
		throw new Error('Invalid survey id');
	} else console.log('currAssessment ====> ', currAssessment);
	if (currAssessment.status === 'completed') {
		// todo: figue this out
		setFlash({ type: 'error', message: 'Assessment already completed' }, event.cookies);
		throw redirect(303, '/thank-you');
	}

	// console.log(`load Token===== assessmentToken `, assessmentToken);

	// console.log(`load Token===== name `, name);
	// console.log(`load Token===== email `, email);
	// console.log(`load Token===== surveyId `, parseInt(surveyId));
	// console.log(`load Token===== schoolId `, parseInt(schoolId));

	let surveyData = await generateQuestionnaire();
	// console.log('surveyData ====> ', surveyData);
	surveyData = [demographicsData, ...surveyData];

	return {
		assessmentToken,
		surveyData
	};
}

export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;

		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

		const { name, email, surveyId, schoolId } = decodedeAssessmentToken;
		try {
			if (data.isDemographics) {
				const { assessmentToken, subjectTaught, yearsTeaching, ...assessmentData } = data;
				const demosParseResult = parseAndTransformCreateDemographicsData.safeParse({
					yearsTeaching: parseInt(String(data.yearsTeaching))!,
					schoolId: parseInt(String(schoolId))!,
					surveyId: parseInt(String(surveyId))!,
					subjectTaught: String(subjectTaught)
				});

				if (!demosParseResult.success) throw new Error('Invalid data');
				const parseAndCheckedDemographicsResponse: CreateDemographicsResponseInput =
					demosParseResult.data;

				await addDemographicsData(parseAndCheckedDemographicsResponse);
				await setSurveyStatus({ surveyId: parseInt(surveyId), status: 'started' });
			} else {
				// survey questions
				const transformedSurveyQuestionsResponses = transformSurveyQuestionsResponses({
					surveyId: parseInt(surveyId),
					...data
				});

				addQuestionsData(transformedSurveyQuestionsResponses);

				if (data.isLastQuestion) {
					setSurveyStatus({ surveyId: parseInt(surveyId), status: 'completed' });
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			const UnexpectedErrorMsg = 'Unexpected error: ' + errorMessage;
			console.log('error => ', UnexpectedErrorMsg);
			setFlash({ type: 'error', message: UnexpectedErrorMsg }, event.cookies);
		}

		if (data.isDemographics) {
			console.log('isDemographics data ====> ', data);
			setFlash({ type: 'success', message: 'Demographics Completed, Thank you!' }, event.cookies);
			return { success: true, isDemographics: true };
		}
		if (data.isLastQuestion) {
			console.log('isDemographics data ====> ', data);
			setFlash({ type: 'success', message: 'Assessment Completed, Thank you!' }, event.cookies);
			throw redirect(303, '/thank-you');
		}
	}
};
