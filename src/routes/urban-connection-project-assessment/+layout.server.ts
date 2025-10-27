import { AssessmentTokenInviteSchema } from '$lib/schema';
import { decodeAssessmentInviteToken } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {}) satisfies LayoutServerLoad;
