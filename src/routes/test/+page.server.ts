import { demographicsData } from '$lib/constants.js';
import { AssessmentTokenInviteSchema } from '$lib/schema';
import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	getAssessmentDataByAssessmentId,
	getDemographicsDataByAssessmentId,
	getAssessmentById,
	setAssessmentStatus
} from '$lib/server/queries';
import {
	type CreateDemographicsResponseInput,
	parseAndTransformCreateDemographicsData
} from '$lib/types/assessment';
import {
	applyAssessmentResponsesToQuestionsAndGetCurrentPositions,
	decodeAssessmentInviteToken,
	transformAssessmentQuestionsResponses
} from '$lib/utils.js';
import { error, redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { is } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { message } from 'sveltekit-superforms';

export async function load({ params, parent, url, cookies }) {
	const parentData = await parent();
	console.log('parentData ====> ', parentData);
	const assessmentToken = await url.searchParams.get('assessmentToken');
	const assessmentId = parseInt(parentData.tokenParseRes.assessmentId);

	const currAssessment = await getAssessmentById(assessmentId);
	if (!currAssessment) {
		setFlash({ type: 'error', message: 'Invalid assessment id' }, cookies);
		throw redirect(401, '/');
	} else if (currAssessment.status === 'completed') {
		setFlash({ type: 'error', message: 'Assessment already completed' }, cookies);
		throw redirect(303, '/thank-you');
	}

	let assessmentQuestions = await generateQuestionnaire();
	let currDemgraphicsData = await getDemographicsDataByAssessmentId(assessmentId);
	let currAssessmentData = await getAssessmentDataByAssessmentId(assessmentId);
	assessmentQuestions = [demographicsData, ...assessmentQuestions];
	let lastAnsweredQuestionIdInDomain;
	let lastAnsweredQuestionIdInSubdomain;

	if (currAssessment.status === 'started') {
		// console.log('currAssessment.status STARTED LOAD THAT DATA! ====> ', currAssessment.status);
		const {
			assessmentQuestionsCopy,
			lastAnsweredQuestionIdInDomain: lastDomain,
			lastAnsweredQuestionIdInSubdomain: lastSubdomain
		} = applyAssessmentResponsesToQuestionsAndGetCurrentPositions({
			assessmentQuestions,
			currDemgraphicsData,
			currAssessmentData
		});
		assessmentQuestions = assessmentQuestionsCopy;
		lastAnsweredQuestionIdInDomain = lastDomain;
		lastAnsweredQuestionIdInSubdomain = lastSubdomain;
	}

	return {
		currDemgraphicsData,
		currAssessmentData,
		assessmentToken,
		assessmentQuestions,
		lastAnsweredQuestionIdInDomain,
		lastAnsweredQuestionIdInSubdomain
	};
}

export const actions = {
	default: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;

		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

		const { assessmentId, schoolId } = decodedeAssessmentToken;
		try {
			if (data.isDemographics) {
				const { assessmentToken, subjectTaught, yearsTeaching, ...assessmentData } = data;
				const demosParseResult = parseAndTransformCreateDemographicsData.safeParse({
					yearsTeaching: parseInt(String(data.yearsTeaching))!,
					schoolId: parseInt(String(schoolId))!,
					assessmentId: parseInt(String(assessmentId))!,
					subjectTaught: String(subjectTaught)
				});

				if (!demosParseResult.success) throw new Error('Invalid data');
				const parseAndCheckedDemographicsResponse: CreateDemographicsResponseInput =
					demosParseResult.data;

				await addDemographicsData(parseAndCheckedDemographicsResponse);
				await setAssessmentStatus({ assessmentId: parseInt(assessmentId), status: 'started' });
			} else {
				// assessment questions
				const transformedAssessmentQuestionsResponses = transformAssessmentQuestionsResponses({
					assessmentId: parseInt(assessmentId),
					...data
				});

				addQuestionsData(transformedAssessmentQuestionsResponses);

				if (data.isLastQuestion) {
					setAssessmentStatus({ assessmentId: parseInt(assessmentId), status: 'completed' });
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			const UnexpectedErrorMsg = 'Unexpected error: ' + errorMessage;
			console.log('error => ', UnexpectedErrorMsg);
			setFlash({ type: 'error', message: UnexpectedErrorMsg }, event.cookies);
		}
		if (!data.isDemographics && !data.isLastQuestion) {
			console.log('server QUESTIONS data ====> ', data);
		}

		if (data.isDemographics) {
			console.log('isDemographics data ====> ', data);
			setFlash({ type: 'success', message: 'Demographics Completed, Thank you!' }, event.cookies);
			return { success: true, isDemographics: true };
		}
		if (data.isLastQuestion) {
			console.log('isDemographics data ====> ', data);
			setFlash({ type: 'success', message: 'Assessment Completed, Thank you!' }, event.cookies);
			return redirect(303, '/thank-you');
		}
	}
};
