import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import type { UserInviteHTMLEmailTemplateType } from './schema';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createInviteToken(name: string, email: string, inviteId: string) {
	const data = `${name}|${email}|${inviteId}`;
	return btoa(data);
}

export function decodeInviteToken(token: string) {
	const data = atob(token);
	const [name, email, inviteId] = data.split('|');
	return { name, email, inviteId };
}

export function handleTypeSafeError(error: unknown, message: any, form: any) {
	const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
	return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
}

export function generateUserId() {
	return nanoid(16);
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
