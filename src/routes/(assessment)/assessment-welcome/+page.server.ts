import { handleLogFlashReturnFormError, logIfDev } from '$lib/utils.js';
import { demographicsQuestionsData } from '$lib/server/constants.js';
import {
	createAssessment,
	createDemographicsData,
	getAssessmentByParticipantEmail,
	getAssessmentInviteById
} from '$lib/server/queries.js';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { db } from '$lib/server/db';

export function load({ cookies, url }) {
	console.log('Assessment Welcome Page Load===========================================');
	const assessmentInviteId = url.searchParams.get('assessmentInviteId');
	if (!assessmentInviteId || assessmentInviteId.length !== 26) {
		return error(400, 'Invalid or missing assessment invite ID');
	}
	console.log('assessmentInviteId => ', assessmentInviteId);
	return {
		demographicsFields: demographicsQuestionsData,
		assessmentInviteId
	};
}

export const actions = {
	create: async (event: RequestEvent) => {
		const data = await event.request.formData();
		console.log('create data => ', data);

		// TODO validate data
		// Example data:
		// 	{
		//   name: 'Billy',
		//   email: 'bonyy@email.com',
		//   isDemographics: 'true',
		//   assessmentInviteId: 'mj7krterHe',
		//   yearsTeaching: '1',
		//   educationLevel: 'K-12'
		// }
		const { name, email, assessmentInviteId, yearsTeaching, educationLevel } = Object.fromEntries(
			data.entries()
		);

		if (!assessmentInviteId) {
			console.error('Missing assessment invite ID');
			return error(400, 'Invalid request: invalid or missing assessment invite ID');
		}
		const currAssessmentInvite = await getAssessmentInviteById({
			id: assessmentInviteId as string
		});
		if (!currAssessmentInvite) {
			console.error('Assessment invite not found or invalid:', currAssessmentInvite);
			return error(400, 'Invalid request: invalid or missing assessment invite ID');
		}

		let newDemographics;
		let newAssessment;
		try {
			const result = await db.transaction(
				async (trx: PgTransaction<PostgresJsQueryResultHKT, any, any> | undefined) => {
					console.log('Creating assessment within transaction for invite:', {
						assessmentId: assessmentInviteId,
						name,
						email,
						schoolId: currAssessmentInvite.schoolId,
						createdBy: currAssessmentInvite.createdBy
					});
					const assessRes = await createAssessment(
						{
							participantName: name as string,
							participantEmail: email as string,
							schoolId: currAssessmentInvite.schoolId,
							createdBy: currAssessmentInvite.createdBy!,
							assessmentInviteId: assessmentInviteId as string //cool bc if we get here we know it's valid
						},
						trx
					);
					console.log('Assessment creation result:', assessRes);

					if (!assessRes) {
						console.error('Failed to create assessment for:', email);
						return error(500, 'Failed to create assessment. Please try again later.');
					}

					const newDemRes = await createDemographicsData(
						{
							assessmentId: assessRes.id,
							schoolId: currAssessmentInvite.schoolId,
							yearsTeaching: parseInt(yearsTeaching as string, 10),
							educationLevel: educationLevel as string
						},
						trx
					);
					if (!newDemRes) {
						console.error('Failed to create demographics for assessment:', assessRes.id);
						return error(500, 'Failed to create demographics. Please try again later.');
					}

					return { assessRes, newDemRes };
				}
			);

			logIfDev('New assessment & demographics created:', newAssessment, newDemographics);
			newAssessment = result.assessRes;
			newDemographics = result.newDemRes;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			const UnexpectedErrorMsg = 'Unexpected error: ' + errorMessage;
		}
		if (!newAssessment) {
			setFlash(
				{ type: 'error', message: 'Could not create assessment. Please try again later.' },
				event.cookies
			);
			return error(404, 'Could not create assessment. Please try again later.');
		}
		redirect(303, `/urban-connection-project-assessment?assessmentId=${newAssessment.id}`);
	},

	resume: async (event) => {
		const data = await event.request.formData();
		console.log('resume data => ', data);
		const email = data.get('email') as string;
		console.log('resume email => ', email);
		const existingAssessment = await getAssessmentByParticipantEmail({ email });
		if (!existingAssessment) {
			console.error('No existing assessment found for email:', email);
			setFlash(
				{ type: 'error', message: 'No existing assessment found with that email.' },
				event.cookies
			);
			return error(404, 'No existing assessment found with that email.');
		}
		redirect(303, `/urban-connection-project-assessment?assessmentId=${existingAssessment.id}`);
	}
};
