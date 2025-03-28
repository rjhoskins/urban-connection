import { demographicsData } from '$lib/constants.js';
import { AssessmentTokenInviteSchema } from '$lib/schema';
import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	getAssessmentDataBySurveyId,
	getDemographicsDataBySurveyId,
	getSurveyById,
	setSurveyStatus
} from '$lib/server/queries';
import {
	type CreateDemographicsResponseInput,
	parseAndTransformCreateDemographicsData
} from '$lib/types/survey';
import {
	applySurveyResponsesToQuestionsAndGetCurrentPositions,
	decodeAssessmentInviteToken,
	transformSurveyQuestionsResponses
} from '$lib/utils.js';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { is } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { message } from 'sveltekit-superforms';

export async function load(event: RequestEvent) {
	const assessmentToken = await event.url.searchParams.get('assessmentToken');
	const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

	const { name, email, surveyId, schoolId } = decodedeAssessmentToken;
	const tokenParseRes = AssessmentTokenInviteSchema.safeParse({ name, email, surveyId, schoolId });
	if (!tokenParseRes.success) {
		setFlash({ type: 'error', message: 'Invalid token' }, event.cookies);
		error(401, {
			message: 'Invalid token'
		});
	}
	// console.log('assessmentToken ====> ', tokenParseRes.data);

	const currAssessment = await getSurveyById(parseInt(surveyId));
	if (!currAssessment) {
		setFlash({ type: 'error', message: 'Invalid survey id' }, event.cookies);
		throw redirect(401, '/');
	} else if (currAssessment.status === 'completed') {
		setFlash({ type: 'error', message: 'Assessment already completed' }, event.cookies);
		throw redirect(303, '/thank-you');
	}

	let surveyQuestions = await generateQuestionnaire();
	let currDemgraphicsData = await getDemographicsDataBySurveyId(parseInt(surveyId));
	let currAssessmentData = await getAssessmentDataBySurveyId(parseInt(surveyId));
	surveyQuestions = [demographicsData, ...surveyQuestions];
	let lastAnsweredDomain;
	let lastAnsweredSubdomainId;

	if (currAssessment.status === 'started') {
		// console.log('currAssessment.status STARTED LOAD THAT DATA! ====> ', currAssessment.status);
		const {
			surveyQuestionsCopy,
			lastAnsweredDomain: lastDomain,
			lastAnsweredSubdomainId: lastSubdomain
		} = applySurveyResponsesToQuestionsAndGetCurrentPositions({
			surveyQuestions,
			currDemgraphicsData,
			currAssessmentData
		});
		surveyQuestions = surveyQuestionsCopy;
		lastAnsweredDomain = lastDomain;
		lastAnsweredSubdomainId = lastSubdomain;
	}

	return {
		currDemgraphicsData,
		currAssessmentData,
		assessmentToken,
		surveyQuestions,
		lastAnsweredDomain,
		lastAnsweredSubdomainId
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
