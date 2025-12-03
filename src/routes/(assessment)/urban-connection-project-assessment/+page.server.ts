import { demographicsQuestionsData } from '$lib/constants.js';
import { AssessmentTokenInviteSchema } from '$lib/schema';
import {
	addQuestionsData,
	generateQuestionnaire,
	setAssessmentStatus,
	getAssessmentById,
	getAssessmentDataByAssessmentId
} from '$lib/server/queries';

import {
	applyAssessmentResponsesToQuestionsAndGetCurrentPositions,
	handleLogFlashReturnFormError,
	transformAssessmentQuestionsResponses
} from '$lib/utils.js';
import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

// http://localhost:5173/urban-connection-project-assessment?assessmentToken=VHpsV1VPYlpwMDhSTWl4NHwyMXwzMzVBQnA=

export async function load({ params, url, cookies }) {
	console.log('page load ====> ');
	const assessmentId = await url.searchParams.get('assessmentId');

	console.log('assessmentId ====> ', assessmentId);

	// token valid - proceed with checking assessment status to load current position
	const currAssessment = await getAssessmentById({
		id: assessmentId as string
	});

	// vars
	const assessmentQuestions = await generateQuestionnaire();
	let answeredAssessmentQuestionsData = [];
	let lastAnsweredQuestionIdInDomain;
	let lastAnsweredQuestionIdInSubdomain;
	let currAssessmentData;

	if (!currAssessment) {
		console.log('NOOOO currAssessment ====> ');
		return error(400, 'Invalid assessment link, contact your administrator or try again later');
	} else if (currAssessment && currAssessment?.status === 'started') {
		console.log('currAssessment in progress ====> ', currAssessment);
		currAssessmentData = currAssessment?.id
			? await getAssessmentDataByAssessmentId(currAssessment?.id!)
			: [];
		console.log('currAssessmentData ====> ', currAssessmentData);

		const {
			appliedAnsweredAssessmentQuestionsData,
			lastCompletedDomainId: lastDomain,
			lastCompletedSubDomainId: lastSubdomain
		} = applyAssessmentResponsesToQuestionsAndGetCurrentPositions({
			assessmentQuestions,
			currAssessmentData
		});
		answeredAssessmentQuestionsData = appliedAnsweredAssessmentQuestionsData;
		// console.log(
		// 	'appliedAnsweredAssessmentQuestionsData ====> ',
		// 	appliedAnsweredAssessmentQuestionsData
		// );
		lastAnsweredQuestionIdInDomain = lastDomain;
		lastAnsweredQuestionIdInSubdomain = lastSubdomain;
	} else if (currAssessment && currAssessment?.status === 'completed') {
		console.log('currAssessment completed ====> ', currAssessment);
		throw redirect(303, '/thank-you');
	}
	return {
		assessmentId,
		assessmentQuestions,
		currAssessment,
		answeredAssessmentQuestionsData,
		lastAnsweredQuestionIdInDomain,
		lastAnsweredQuestionIdInSubdomain
	};
}

export const actions = {
	default: async (event: RequestEvent) => {
		let hasError = false;
		let UnexpectedErrorMsg = '';
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const assessmentId = data.assessmentId;

		if (assessmentId !== event.url.searchParams.get('assessmentId')) {
			return fail(400, { message: 'something tricky is afoot' });
		}

		// token valid - proceed with checking assessment status to load current position
		const currAssessment = await getAssessmentById({
			id: assessmentId as string
		});

		try {
			// assessment questions
			console.log('QUESTIONS data ====> ', data);
			console.log('currAssessment =>  ', currAssessment);

			if (!currAssessment) {
				setFlash({ type: 'error', message: 'Assessment not found' }, event.cookies);
				throw redirect(400, '/');
			}
			const transformedAssessmentQuestionsResponses = transformAssessmentQuestionsResponses({
				...data,
				assessmentId: currAssessment.id
			});
			// console.log(
			// 	'transformedAssessmentQuestionsResponses data ====> ',
			// 	transformedAssessmentQuestionsResponses
			// );

			if (!transformedAssessmentQuestionsResponses.length) {
				setFlash({ type: 'error', message: 'No assessment data to save' }, event.cookies);
				throw redirect(400, '/');
			}

			await addQuestionsData(transformedAssessmentQuestionsResponses);

			if (data.isLastQuestion) {
				setAssessmentStatus({
					assessmentId: currAssessment.id,
					status: 'completed'
				});
			}
		} catch (error) {
			hasError = true;
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			UnexpectedErrorMsg = 'SERVER Unexpected error: ' + errorMessage;
			console.log('error => ', UnexpectedErrorMsg);
			setFlash({ type: 'error', message: 'malformed token' + UnexpectedErrorMsg }, event.cookies);
			return redirect(303, '/');
			// return { success: false, error: UnexpectedErrorMsg };
		}

		if (data.isDemographics && !hasError && !data.isLastQuestion) {
			console.log('isDemographics data ====> ', data);
			if (data.name && data.email) {
				setFlash({ type: 'success', message: 'Demographics Completed, Thank you!' }, event.cookies);
				return { success: true, isDemographics: true };
			}
		}
		if (data.isLastQuestion && !hasError) {
			console.log('isLastQuestion data ====> ', data);
			setFlash({ type: 'success', message: 'Assessment Completed, Thank you!' }, event.cookies);
			return redirect(303, '/thank-you');
		}
	}
};
