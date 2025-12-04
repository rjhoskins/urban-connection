import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ulid } from 'ulid';
import type { UserInviteHTMLEmailTemplateType } from './schema';
import { message, type SuperValidated } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Domain, Question, Subdomain, AssessmentData } from './types/assessment';
import { dev } from '$app/environment';

type Message = { status: 'error' | 'success' | 'warning'; text: string };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function handleTypeSafeError(error: unknown, message: any, form: any) {
	const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
	return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
}

interface HandleLogFlashReturnFormErrorParams {
	type: 'error' | 'success';
	form: SuperValidated<any, Message, any> | null;
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
	setFlash({ type, message: messageText.toString() }, event.cookies);
	return message(form, { status: type, text: messageText.toString() });
}

export function generateAdminInviteEmail(
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

export function transformAssessmentData(
	rawData: {
		domain: { id: string; name: string; type: 'domain' };
		subdomain: { id: string; name: string; description: string; type: 'sub-domain' };
		question: { id: string; text: string; value: boolean | null; subdomainId: string };
	}[]
): AssessmentData[] {
	// Group by domains first
	const domainMap = new Map();

	rawData.forEach((item) => {
		const {
			domain,
			subdomain,
			question
		}: {
			domain: { id: string; name: string; type: 'domain' };
			subdomain: { id: string; name: string; description: string; type: 'sub-domain' };
			question: { id: string; text: string; value: boolean | null; subdomainId: string };
		} = item;

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
		let subdomainObj = domainObj.subDomains.find((sub: any) => sub.name === subdomain.name);
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

type AssessmentResponseData = {
	assessmentId: string;
	[key: string]: string;
};

type TransformedResponse = {
	assessmentId: string;
	questionId: string;
	isValidSubdomainGroup: boolean;
	response: 0 | 1 | null;
};

export function transformAssessmentQuestionsResponses(
	data: AssessmentResponseData
): TransformedResponse[] {
	const { assessmentId, ...responses } = data;

	const rawData = Object.entries(responses)
		.filter(([key]) => key.startsWith('domainId='))
		.map(([key, value]) => {
			// const match = key.match(/domainId=(\d+)\|subDomainId=(\d+)\|qId=(\d+)/); //number IDs --- IGNORE ---
			const match = key.match(/domainId=(.*)\|subDomainId=(.*)\|qId=(.*)/); //string IDs
			if (!match) return null; // This won't happen with valid data

			const [, domainId, subDomainId, questionId] = match;
			return {
				assessmentId: assessmentId,
				questionId: questionId,
				subDomainId: subDomainId,
				response: value === '' ? null : parseInt(String(value)) === 1 ? 1 : 0
			};
		})
		.filter((item) => item !== null);

	let currSubdomainId;

	const transformedAssessmentQuestionsResponses = rawData.map((item, _, array) => {
		const currSubdomainId = item.subDomainId;
		const currGroup = array.filter((item) => item.subDomainId === currSubdomainId);
		const subDomainHasNullResponse = array
			.filter((el) => el.subDomainId === currSubdomainId)
			.some((el) => el.response === null); // whole subdomain is tainted if any question is un-answered
		return {
			assessmentId: item.assessmentId,
			questionId: item.questionId,
			isValidSubdomainGroup: !subDomainHasNullResponse,
			response: item.response
		};
	});
	//
	return transformedAssessmentQuestionsResponses as TransformedResponse[];
}

export function applyAssessmentResponsesToQuestionsAndGetCurrentPositions({
	assessmentQuestions,
	currAssessmentData
}: {
	assessmentQuestions: any[];
	currAssessmentData: any[];
}) {
	let answeredAssessmentQuestionsData = JSON.parse(JSON.stringify(assessmentQuestions));
	//
	//
	//

	let lastCompletedDomainId;
	let lastCompletedSubDomainId;
	let domainIdsArr: any[] = [];
	let subdomainIdsArr: any[] = [];
	answeredAssessmentQuestionsData.forEach((domain: any) => {
		domainIdsArr.push(domain.id);
		domain?.subDomains?.forEach((subdomain: any, idx: number) => {
			subdomainIdsArr.push(subdomain.id);
			subdomain.questions.forEach((question: any) => {
				const questionHasResponse = currAssessmentData.some(
					(response: any) => response.questionId === question.id
				);

				if (questionHasResponse) {
					lastCompletedSubDomainId = subdomain.id;
					//
					//
					lastCompletedDomainId = domain.id;
					//

					const foundResponse = currAssessmentData.find(
						(response: any) => response.questionId === question.id
					);

					const questionResponse = foundResponse ? foundResponse.response : null;
					//
					if (questionResponse === 1 || questionResponse === 0) {
						question.value = questionResponse;
					} else {
						question.value = null;
					}
				}
			});
		});
	});

	return {
		appliedAnsweredAssessmentQuestionsData: answeredAssessmentQuestionsData,
		lastCompletedDomainId,
		lastCompletedSubDomainId
	};
}

export function getScoreBackgroundColor(score: number) {
	if (score > 80) {
		return 'bg-[#CCFFBD]';
	} else if (score > 50) {
		return 'bg-[#F9F5D8]';
	} else {
		return 'bg-[#FEF4F5]';
	}
}
export function getProgressBarBackgroundColor(score: number) {
	if (score > 80) {
		return 'bg-[#34C759]';
	} else if (score > 50) {
		return 'bg-[#C9B53D]';
	} else {
		return 'bg-[#FEF4F5]';
	}
}

export function formDataToObject(formData: FormData) {
	const obj: Record<string, FormDataEntryValue> = {};
	for (const [key, value] of formData.entries()) {
		obj[key] = value;
	}
	return obj;
}

export function logIfDev(message: string, ...optionalParams: any[]) {
	if (dev) {
	}
}
