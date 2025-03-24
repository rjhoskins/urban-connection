import {
	getHtmlTemplateTypes,
	getLatestHtmlTemplateDataByType,
	updateHtmlTemplateData
} from '$lib/server/queries';
import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolAdminUserInviteHTMLEmailTemplateSchema } from '$lib/schema';
import { setFlash } from 'sveltekit-flash-message/server';
import { handleLogFlashReturnFormError } from '$lib/utils';

export const load = (async (event) => {
	if (event.locals.user?.role !== 'super_admin') {
		return {
			status: 403,
			error: new Error('Forbidden')
		};
	}
	// TODO: should be a valid template type baseds on query to db
	const type = event.params.templateType as 'admin_invite' | 'assessment_invite';
	if (type !== 'admin_invite' && type !== 'assessment_invite') {
		throw new Error('Invalid template type');
	}
	let form;
	let htmlTemplate;
	switch (type) {
		case 'admin_invite':
			htmlTemplate = await getLatestHtmlTemplateDataByType('admin_invite');
			console.log('loaded htmlTemplate => ', htmlTemplate);
			form = await superValidate(zod(schoolAdminUserInviteHTMLEmailTemplateSchema));
			if (form && htmlTemplate) {
				form.data = htmlTemplate.template;
			}

			break;
		case 'assessment_invite':
			htmlTemplate = await getLatestHtmlTemplateDataByType('assessment_invite');
			console.log('loaded htmlTemplate => ', htmlTemplate);
			form = await superValidate(zod(schoolAdminUserInviteHTMLEmailTemplateSchema));
			if (form && htmlTemplate) {
				form.data = htmlTemplate.template;
			}

			break;
		default:
			throw new Error('Invalid template type');
	}

	return {
		type,
		form,
		template: await getLatestHtmlTemplateDataByType(type)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.user?.role !== 'super_admin') {
			return {
				status: 403,
				error: new Error('Forbidden')
			};
		}
		const form = await superValidate(
			event.request,
			zod(schoolAdminUserInviteHTMLEmailTemplateSchema)
		);

		console.log('form => ', form);
		if (!form.valid) {
			console.log('form.errors => ', form.errors);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: 'Invalid form',
				status: 400,
				event
			});
		}
		const type = event.params.templateType;
		console.log('type => ', type, form.data);

		try {
			// throw new Error('testing...');
			const type = event.params.templateType;
			if (type !== 'admin_invite' && type !== 'assessment_invite') {
				throw new Error('Invalid template type');
			}
			const [htmlEmailRes] = await updateHtmlTemplateData({ data: form.data, type });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			return handleLogFlashReturnFormError({
				type: 'error',
				form,
				message: errorMessage,
				status: 500,
				event
			});
		}

		setFlash({ type: 'success', message: 'Email template data saved' }, event.cookies);

		// return form;
	}
};
