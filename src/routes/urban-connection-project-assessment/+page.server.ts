import { demographicsData } from '$lib/constants.js';
import { AssessmentTokenInviteSchema } from '$lib/schema';
import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	getAssessmentDataByAssessmentId,
	getDemographicsDataByAssessmentId,
	getAssessmentByParticipantEmail,
	setAssessmentStatus,
	createAssessment
} from '$lib/server/queries';
import { createMixedBagAssessmentAndDemographics } from '$lib/types/assessment.js';
import {
	applyAssessmentResponsesToQuestionsAndGetCurrentPositions,
	decodeAssessmentInviteToken,
	transformAssessmentQuestionsResponses
} from '$lib/utils.js';
import { error, fail, redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { is } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { message } from 'sveltekit-superforms';

export async function load({ params, parent, url, cookies }) {
	console.log('page load ====> ');
	const parentData = await parent();
	console.log('parentData ====> ', parentData);
	const assessmentToken = await url.searchParams.get('assessmentToken');
	const assessmentId = parseInt(parentData.tokenParseRes.sentBy);
	const schoolId = parseInt(parentData.tokenParseRes.schoolId);

	if (!assessmentToken || !schoolId) {
		console.log('here ====> ');
		setFlash({ type: 'error', message: 'malformed token' }, cookies);
		throw redirect(401, '/');
	}

	// if (!currAssessment) {
	// 	console.log('currAssessment ====> ', currAssessment);
	// 	setFlash({ type: 'error', message: 'Invalid assessment id' }, cookies);
	// 	throw redirect(401, '/');
	// } else if (currAssessment.status === 'completed') {
	// 	setFlash({ type: 'error', message: 'Assessment already completed' }, cookies);
	// 	throw redirect(303, '/thank-you');
	// }

	let assessmentQuestions = await generateQuestionnaire();
	// let currDemgraphicsData = await getDemographicsDataByAssessmentId(assessmentId);
	// let currAssessmentData = await getAssessmentDataByAssessmentId(assessmentId);
	assessmentQuestions = [demographicsData, ...assessmentQuestions];
	let lastAnsweredQuestionIdInDomain;
	let lastAnsweredQuestionIdInSubdomain;

	// if (currAssessment.status === 'started') {
	// 	// console.log('currAssessment.status STARTED LOAD THAT DATA! ====> ', currAssessment.status);
	// 	const {
	// 		assessmentQuestionsCopy,
	// 		lastAnsweredQuestionIdInDomain: lastDomain,
	// 		lastAnsweredQuestionIdInSubdomain: lastSubdomain
	// 	} = applyAssessmentResponsesToQuestionsAndGetCurrentPositions({
	// 		assessmentQuestions,
	// 		currDemgraphicsData,
	// 		currAssessmentData
	// 	});
	// 	assessmentQuestions = assessmentQuestionsCopy;
	// 	lastAnsweredQuestionIdInDomain = lastDomain;
	// 	lastAnsweredQuestionIdInSubdomain = lastSubdomain;
	// }

	return {
		// currDemgraphicsData,
		// currAssessmentData,
		assessmentToken,
		assessmentQuestions,
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
		// console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;
		let currAssessmentId;
		let currAssessmentData: any[] | [];
		let newDemographicsData = {};

		const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

		const sentBy = decodedeAssessmentToken.sentBy;
		const schoolId = parseInt(decodedeAssessmentToken.schoolId);
		try {
			if (data.isDemographics) {
				console.log('DEMO data ====> ', data);
				const parseRes = createMixedBagAssessmentAndDemographics.safeParse({ ...data, schoolId });

				if (!parseRes.success) {
					console.log('parseRes error => ', JSON.stringify(parseRes.error.flatten().fieldErrors));
					// setFlash({ type: 'error', message: 'server invalid data' }, event.cookies);
					error(400, { message: JSON.stringify(parseRes.error.flatten().fieldErrors) });
				}
				// create or find assessment by email
				const existingAssessment = await getAssessmentByParticipantEmail({
					email: data.email as string,
					schoolId
				});
				if (existingAssessment) {
					// get currResults
					currAssessmentId = parseInt(String(existingAssessment.id));

					setFlash(
						{ type: 'success', message: 'Welcome back, picking up from where you left off...' },
						event.cookies
					);
				} else {
					const newAssessment = await createAssessment({
						participantName: data.name as string,
						participantEmail: data.email as string,
						schoolId,
						sentBy
					});
					console.log('newAssessment ====> ', newAssessment);
					if (!newAssessment) throw new Error('Failed to create assessment');
					currAssessmentId = parseInt(String(newAssessment.id));

					setFlash({ type: 'success', message: 'Thanks!  Let\s begin!...' }, event.cookies);
				}

				//add demographics data
				newDemographicsData = {
					yearsTeaching: parseInt(String(data.yearsTeaching))!,
					schoolId,
					assessmentId: currAssessmentId,
					subjectTaught: String(data.subjectTaught)
				};
				await addDemographicsData(newDemographicsData);
				await setAssessmentStatus({ assessmentId: currAssessmentId, status: 'started' });

				return {
					success: true,
					isDemographics: true,
					currAssessmentId: currAssessmentId,
					currAssessmentData: await getAssessmentDataByAssessmentId(currAssessmentId),
					currDemographicsData: newDemographicsData
				};
			} else {
				// assessment questions
				console.log('QUESTION data ====> ', data);
				const transformedAssessmentQuestionsResponses = transformAssessmentQuestionsResponses({
					assessmentId: parseInt(data.assessmentId as string),
					...data
				});
				// console.log(
				// 	'transformedAssessmentQuestionsResponses data ====> ',
				// 	transformedAssessmentQuestionsResponses
				// );

				addQuestionsData(transformedAssessmentQuestionsResponses);

				if (data.isLastQuestion) {
					// setAssessmentStatus({ assessmentId: parseInt(assessmentId), status: 'completed' });
				}
			}
		} catch (error) {
			hasError = true;
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			UnexpectedErrorMsg = 'SERVER Unexpected error: ' + errorMessage;
			console.log('error => ', UnexpectedErrorMsg);
			setFlash({ type: 'error', message: 'malformed token' }, event.cookies);
			return redirect(303, '/');
			return { success: false, error: UnexpectedErrorMsg };
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
