import { AssessmentTokenInviteSchema } from '$lib/schema';
import { decodeAssessmentInviteToken } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
	const assessmentToken = await event.url.searchParams.get('assessmentToken');
	const decodedeAssessmentToken = decodeAssessmentInviteToken(assessmentToken as string);

	const { assessmentId, schoolId } = decodedeAssessmentToken;
	const tokenParseRes = AssessmentTokenInviteSchema.safeParse({
		assessmentId,
		schoolId
	});
	if (!tokenParseRes.success) {
		setFlash({ type: 'error', message: 'Invalid token' }, event.cookies);
		error(401, {
			message: 'Invalid token'
		});
	}

	console.log('assessmentToken ====> ', tokenParseRes.data);
	return {
		tokenParseRes: tokenParseRes.data
	};
}) satisfies LayoutServerLoad;
