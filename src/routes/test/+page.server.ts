import * as db from '$lib/server/database.js';
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
import { transformSurveyQuestionsResponses } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export async function load(event) {
	const surveyId = event.url.searchParams.get('surveyId');
	// console.log(' test load=============================>', surveyId);
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	return {
		surveyId,
		surveyData: await generateQuestionnaire()
	};
}

export const actions = {
	submit: async (event) => {
		const TEST_SCHOOL_ID = 20;
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		console.log('data => ', data);
		console.log('data.demographics => ', data.demographics);
		// demographics (one)
		if (data.demographics) {
			const parseResult = createSurveyDemographicsResponseSchema.safeParse(data);
			if (!parseResult.success) return { success: false, data: data };
			const demographicsResponse: CreateDemographicsResponseInput = parseResult.data;
			console.log('demographicsResponse => ', demographicsResponse);
			console.log('create  => ', { ...demographicsResponse, schoolId: TEST_SCHOOL_ID });
			addDemographicsData({ ...demographicsResponse, schoolId: TEST_SCHOOL_ID });
			return { success: true, data };
		}

		// survey questions
		//check all anwered
		const dataArr = Object.keys(data);
		const numAnswered = dataArr.filter((el) => el.includes('qId'));
		if (data.isFirstQuestion) {
			console.log('isFirstQuestion');
			//set status to started
			setSurveyStatus({ surveyId: parseInt(data.surveyId as string), status: 'started' });
		}
		if (data.isLastQuestion) {
			console.log('isLastQuestion');
			//set status to started
			setSurveyStatus({ surveyId: parseInt(data.surveyId as string), status: 'completed' });
			setFlash({ type: 'success', message: 'Survy Completed Thank you!' }, event.cookies);
			throw redirect(303, '/thank-you');
		}

		if (Number(data.totalQuestions) === numAnswered.length) {
			// send to db
			console.log('all answered');
			const surveyQuestionResponses = transformSurveyQuestionsResponses(data);
			addQuestionsData(surveyQuestionResponses as CreateQuestionResponseInput);
		} else {
			// do nothing
			console.log('NOT all answered - do nothing');
		}
	}
};
