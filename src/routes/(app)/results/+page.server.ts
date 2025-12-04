import {
	getAllTimeQuestionResponsesByDomain,
	getAllTimeQuestionResponsesStatsByQuestion
} from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		domainData: await getAllTimeQuestionResponsesByDomain(),
		questionsData: await getAllTimeQuestionResponsesStatsByQuestion()
	};
}) satisfies PageServerLoad;
