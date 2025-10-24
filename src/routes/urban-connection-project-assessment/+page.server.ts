import { demographicsQuestionsData } from '$lib/constants.js';
import { AssessmentTokenInviteSchema } from '$lib/schema';
import {
	addDemographicsData,
	addQuestionsData,
	generateQuestionnaire,
	getAssessmentDataByAssessmentId,
	getDemographicsDataByAssessmentId,
	setAssessmentStatus,
	createAssessment,
	getSchoolAssessmentIDByTokenCode,
	getAssessmentByParticipantEmail,
	getSchoolById
} from '$lib/server/queries';
import { createMixedBagAssessmentAndDemographics } from '$lib/types/assessment.js';
import {
	applyAssessmentResponsesToQuestionsAndGetCurrentPositions,
	decodeAssessmentInviteToken,
	handleLogFlashReturnFormError,
	transformAssessmentQuestionsResponses
} from '$lib/utils.js';
import { error, fail, redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { is } from 'drizzle-orm';
import { request } from 'http';
import { setFlash } from 'sveltekit-flash-message/server';
import { message } from 'sveltekit-superforms';

export async function load({ params, url, cookies }) {
	console.log('page load ====> ');
	const assessmentToken = await url.searchParams.get('assessmentToken');
	const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);
	console.log('decodedeAssessmentToken ====> ', decodedeAssessmentToken);

	//data validation
	const { sentBy, schoolId, code } = decodedeAssessmentToken;
	const tokenParseRes = AssessmentTokenInviteSchema.safeParse({
		sentBy,
		schoolId,
		code
	});
	if (!assessmentToken || !schoolId || !code) {
		console.log('here ====> ', { assessmentToken, schoolId, code });
		setFlash({ type: 'error', message: 'load malformed token' }, cookies);
		throw redirect(401, '/');
	}

	//data good - school & token good?
	let isvalidSchool = await isValidSchool(schoolId, cookies);
	if (!isvalidSchool || code.length !== 6) {
		console.log('invalid school OR TOKEN ====> ');
		setFlash({ type: 'error', message: 'malformed token' }, cookies);
		throw redirect(401, '/');
	}

	//check if assessment exists already for school & token code - assumes first vist equals started so page load can handle started status
	let currAssessment = await getSchoolAssessmentIDByTokenCode({
		code,
		schoolId
	});
	// vars

	let assessmentQuestions = await generateQuestionnaire();
	let lastAnsweredQuestionIdInDomain;
	let lastAnsweredQuestionIdInSubdomain;
	let currAssessmentData;
	let currDemgraphicsData;

	if (!currAssessment) {
		console.log('NOOOO currAssessment ====> ');
		// setFlash({ type: 'success', message: "Let's get started!" }, cookies);
		assessmentQuestions = [demographicsQuestionsData, ...assessmentQuestions];
		console.log('assessmentQuestions LENGTH ====> ', assessmentQuestions.length);
	} else if (currAssessment && currAssessment?.status === 'started') {
		//gets intense here ===>
		console.log('currAssessment STARTED ====> ', currAssessment);
		currDemgraphicsData = currAssessment?.id
			? await getDemographicsDataByAssessmentId(currAssessment?.id!)
			: null;
		console.log('currDemgraphicsData ====> ', currDemgraphicsData);
		currAssessmentData = currAssessment?.id
			? await getAssessmentDataByAssessmentId(currAssessment?.id!)
			: null;

		const {
			assessmentQuestionsCopy,
			lastCompletedDomainId: lastDomain,
			lastCompletedSubDomainId: lastSubdomain
		} = applyAssessmentResponsesToQuestionsAndGetCurrentPositions({
			assessmentQuestions,
			currDemgraphicsData,
			currAssessmentData: currAssessmentData!
		});
		assessmentQuestions = assessmentQuestionsCopy;
		lastAnsweredQuestionIdInDomain = lastDomain;
		lastAnsweredQuestionIdInSubdomain = lastSubdomain;
		assessmentQuestions = [demographicsQuestionsData, ...assessmentQuestions];
		setFlash({ type: 'success', message: "Welcome back, let's continue!" }, cookies);
	} else if (currAssessment && currAssessment?.status === 'completed') {
		console.log('currAssessment COMPLETED ====> ', currAssessment);
		setFlash({ type: 'error', message: 'Assessment already completed' }, cookies);
		throw redirect(303, '/thank-you');
	}

	// console.log('THIS ====> ', {
	// 	// currDemgraphicsData,
	// 	// currAssessmentData,
	// 	// assessmentToken,
	// 	// assessmentQuestions: assessmentQuestions.slice(0, 10)
	// 	// lastAnsweredQuestionIdInDomain,
	// 	// lastAnsweredQuestionIdInSubdomain
	// });

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
		let hasError = false;
		let UnexpectedErrorMsg = '';
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('SUBMIT data ====> ', data);
		const assessmentToken = data.assessmentToken;

		let newDemographicsData = {};

		if (assessmentToken !== event.url.searchParams.get('assessmentToken')) {
			return fail(400, { message: 'some trickey is afoot' });
		}
		const { sentBy, schoolId, code } = decodeAssessmentInviteToken(assessmentToken as string);

		console.log('actions decodedeAssessmentToken ====> ', { sentBy, schoolId, code });
		const isValid = await isValidSchool(schoolId, event.cookies);

		if (!isValid) {
			return fail(400, {
				message: 'Issue with link, contact your administrator or try again later'
			});
		}

		//every request so data is good
		const currAssessment = await createOrFindAssessmentByEmail({
			participantEmail: String(data.email),
			schoolId,
			sentBy,
			tokenCode: code,
			participantName: String(data.name),
			event
		});
		console.log('currAssessment after createOrFindAssessmentByEmail ====> ', currAssessment);

		try {
			if (data.isDemographics) {
				console.log('DEMO data ====> ', data);
				const isValidDemographics = isValidDemographicsData({
					data,
					schoolId,
					sentBy,
					code
				});
				if (!isValidDemographics) {
					return fail(400, { message: 'Invalid demographics data' });
				}

				if (!currAssessment) {
					throw new Error('Assessment not found');
				}
				//add demographics data
				newDemographicsData = {
					yearsTeaching: parseInt(String(data.yearsTeaching))!,
					schoolId,
					assessmentId: currAssessment.id,
					educationLevel: String(data.educationLevel)
				};
				await addDemographicsData(newDemographicsData);
				if (!currAssessment) throw new Error('Failed to create or find assessment');

				// set assessment status to started on demographics completion
				await setAssessmentStatus({ assessmentId: currAssessment.id, status: 'started' });

				//all set here demographics wise
				return {
					success: true,
					isDemographics: true,
					currAssessmentId: currAssessment.id,
					currAssessmentData: await getAssessmentDataByAssessmentId(currAssessment.id),
					currDemographicsData: newDemographicsData
				};
			} else {
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

async function isValidSchool(schoolId: number, cookies: any) {
	let isValidSchool = false;
	try {
		const school = await getSchoolById(schoolId);
		if (!school) {
			setFlash({ type: 'error', message: 'malformed token, invalid school' }, cookies);
			throw redirect(401, '/');
		}
		isValidSchool = true;
	} catch (error) {
		setFlash({ type: 'error', message: 'encountered an error' }, cookies);
		throw redirect(401, '/');
	}
	return isValidSchool;
}

async function createOrFindAssessmentByEmail({
	participantEmail,
	schoolId,
	sentBy,
	tokenCode,
	participantName,
	event,
	isLoadEvent = false
}: {
	participantEmail: string;
	schoolId: number;
	sentBy: string;
	tokenCode: string;
	participantName: string;
	event: RequestEvent;
	isLoadEvent?: boolean;
}): Promise<{ id: number; status: 'sent' | 'started' | 'completed' | null } | null> {
	//quick data check
	if (!participantEmail || !schoolId || !sentBy || tokenCode.length !== 6 || !participantName) {
		if (!isLoadEvent) {
			setFlash(
				{
					type: 'error',
					message: 'Issue with link, contact your administrator or try again later'
				},
				event.cookies
			);
		}
		throw redirect(400, '/');
	}
	let assessment;

	try {
		assessment = await getSchoolAssessmentIDByTokenCode({
			code: tokenCode,
			schoolId
		});

		if (assessment) {
			return assessment;
		}

		const newAssessment = await createAssessment({
			participantName,
			participantEmail,
			schoolId,
			sentBy,
			tokenCode
		});
		console.log('newAssessment ====> ', newAssessment);
		assessment = newAssessment;

		if (!assessment) throw new Error('Failed to find or create assessment');

		return { id: assessment.id, status: 'sent' };
	} catch (error) {
		console.error('Failed to create or find assessment:', error);

		return null;
	}
}

function isValidDemographicsData({
	data,
	schoolId,
	sentBy,
	code
}: {
	data: any;
	schoolId: number;
	sentBy: string;
	code: string;
}) {
	const parseRes = createMixedBagAssessmentAndDemographics.safeParse({
		...data,
		schoolId,
		sentBy,
		code
	});

	if (!parseRes.success) {
		console.log('parseRes error => ', JSON.stringify(parseRes.error.flatten().fieldErrors));
		error(400, { message: JSON.stringify(parseRes.error.flatten().fieldErrors) });
		return false;
	}
	return true;
}
