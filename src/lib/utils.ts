import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import type { UserInviteHTMLEmailTemplateType } from './schema';
import { message, type SuperValidated } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Domain, Question, Subdomain, SurveyData } from './types/survey';

type Message = { status: 'error' | 'success' | 'warning'; text: string };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createAdminUserInviteToken(name: string, email: string, inviteId: string) {
	const data = `${name}|${email}|${inviteId}`;
	return btoa(data);
}

export function decodeAdminUserInviteToken(token: string) {
	const data = atob(token);
	const [name, email, inviteId] = data.split('|');
	return { name, email, inviteId };
}
export function createAssessmentInviteToken({
	name,
	email,
	surveyId,
	schoolId
}: {
	name: string;
	email: string;
	surveyId: number;
	schoolId: number;
}) {
	const data = `${name}|${email}|${surveyId}|${schoolId}`;
	return btoa(data);
}

export function decodeAssessmentInviteToken(token: string) {
	const data = atob(token);
	const [name, email, surveyId, schoolId] = data.split('|');
	return { name, email, surveyId, schoolId };
}

export function handleTypeSafeError(error: unknown, message: any, form: any) {
	const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
	return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
}

export function generateUserId() {
	return nanoid(16);
}

interface HandleLogFlashReturnFormErrorParams {
	type: 'error' | 'success';
	form: SuperValidated<any>;
	message: string | Message;
	status: 400 | 401 | 402 | 403 | 404 | 500;
	event: RequestEvent;
}

export function handleLogFlashReturnFormError({
	type,
	form,
	message: messageText,
	status: statusNum,
	event
}: HandleLogFlashReturnFormErrorParams) {
	console.error(messageText);
	setFlash({ type, message: messageText.toString() }, event.cookies);
	return message(form, { status: type, text: messageText.toString() });
}

export function generateNewUserInviteEmail(
	htmlEmailContent: UserInviteHTMLEmailTemplateType,
	inviteLink: string
) {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Urban Connection Project</title>
    <style type="text/css">
        /* Client-specific styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }

        /* Reset styles */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

        /* Custom styles */
        .email-container { max-width: 600px; margin: auto; }
        .content-block { padding: 24px; }
        .text-blue { color: #1d4ed8 !important; }
        .list-item { padding: 8px 0; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td class="content-block" style="padding: 24px;">
                            <p style="margin-bottom: 16px;">${htmlEmailContent.greeting}</p>
                            
                            <p style="margin-bottom: 16px;">${htmlEmailContent.definition}</p>
                            
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                ${htmlEmailContent.keyPoints
																	.map(
																		(point) => `     <tr>
                                    <td style="padding: 0 0 8px 24px;">• ${point}</td>
                                </tr>`
																	)
																	.join('')} 
                            </table>
                            
                            <p style="margin-bottom: 16px;">${htmlEmailContent.closing}</p>
                            
                            <p style="margin-bottom: 16px;">${htmlEmailContent.callToAction}
                                <a href=${inviteLink} 
                                   style="color: #1d4ed8; text-decoration: underline; font-size: 18px;">${htmlEmailContent.registrationLinkText}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export function slugify(text: string): string {
	return text
		.toString()
		.normalize('NFKD') // Normalize unicode characters
		.toLowerCase() // Convert to lowercase
		.trim() // Remove whitespace from ends
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, '') // Remove non-word chars (except hyphens)
		.replace(/\-\-+/g, '-') // Replace multiple hyphens with single
		.replace(/^-+/, '') // Remove hyphens from start
		.replace(/-+$/, ''); // Remove hyphens from end
}

export function transformSurveyData(rawData: SurveyData) {
	// Group by domains first
	const domainMap = new Map();

	rawData.forEach((item) => {
		const {
			domain,
			subdomain,
			question
		}: { domain: Domain; subdomain: Subdomain; question: Question } = item;

		// Initialize domain if it doesn't exist
		if (!domainMap.has(domain.id)) {
			domainMap.set(domain.id, {
				id: domain.id,
				name: domain.name,
				type: 'domain',
				subDomains: []
			});
		}

		const domainObj = domainMap.get(domain.id);

		// Find or create subdomain
		let subdomainObj = domainObj.subDomains.find((sub) => sub.name === subdomain.name);
		if (!subdomainObj) {
			subdomainObj = {
				id: subdomain.id,
				name: subdomain.name,
				type: 'sub-domain', // Special case for Systems domain
				description: subdomain.description,
				questions: []
			};
			domainObj.subDomains.push(subdomainObj);
		}

		// Add question to subdomain using original question ID
		subdomainObj.questions.push({
			id: question.id,
			subdomainId: subdomain.id,
			value: null, // Explicitly set to null
			text: question.text
		});
	});

	// Sort everything for consistency
	const result = Array.from(domainMap.values());

	return result;
}

type SurveyResponseData = {
	surveyId: number;
	[key: string]: string | number;
};

type TransformedResponse = {
	surveyId: number;
	questionId: number;
	isValidSubdomainGroup: boolean;
	response: 0 | 1 | null;
};

export function transformSurveyQuestionsResponses(data: SurveyResponseData): TransformedResponse[] {
	const { surveyId, ...responses } = data;

	const rawData = Object.entries(responses)
		.filter(([key]) => key.startsWith('domainId='))
		.map(([key, value]) => {
			const match = key.match(/domainId=(\d+)\|subDomainId=(\d+)\|qId=(\d+)/);
			if (!match) return null; // This won't happen with valid data

			const [, domainId, subDomainId, questionId] = match;
			return {
				surveyId: surveyId,
				questionId: parseInt(questionId, 10),
				subDomainId: parseInt(subDomainId, 10),
				response: value === '' ? null : parseInt(String(value)) === 1 ? 1 : 0
			};
		})
		.filter((item) => item !== null);
	console.log('rawData  ====> ', rawData);
	let currSubdomainId;

	const transformedSurveyQuestionsResponses = rawData.map((item, _, array) => {
		const currSubdomainId = item.subDomainId;
		const currGroup = array.filter((item) => item.subDomainId === currSubdomainId);
		const subDomainHasNullResponse = array
			.filter((el) => el.subDomainId === currSubdomainId)
			.some((el) => el.response === null); // whole subdomain is tainted if any question is un-answered
		return {
			surveyId: item.surveyId,
			questionId: item.questionId,
			isValidSubdomainGroup: !subDomainHasNullResponse,
			response: item.response
		};
	});
	console.log(
		'TESTtransformedSurveyQuestionsResponses  ====> ',
		transformedSurveyQuestionsResponses
	);
	return transformedSurveyQuestionsResponses as TransformedResponse[];
}
