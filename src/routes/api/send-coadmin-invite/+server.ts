import { json, type RequestHandler } from '@sveltejs/kit';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { generateAdminInviteEmail } from '$lib/utils';
import { dev } from '$app/environment';
import env from '../../../env';

// OAuth2 configuration
const OAuth2Client = new google.auth.OAuth2(
	env.GOOGLE_OAUTH_CLIENT_ID,
	env.GOOGLE_OAUTH_CLIENT_SECRET,
	env.GOOGLE_OAUTH_REDIRECT_URI
);

OAuth2Client.setCredentials({
	refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN
});

// export const GET: RequestHandler = async () => {
// 	console.log('GET /api/send-coadmin-invite==================> ');
// 	return json({ message: 'GET /api/send-coadmin-invite', 'application/json': '' });
// };

export const POST: RequestHandler = async (event) => {
	const res = await event.request.json();
	console.log('POST /api/send-coadmin-invite============> ', res);
	try {
		if (dev) {
			await sendDevEmail({ ...res });
			return json({ status: 'success', message: 'Dev Email sent' });
		} else {
			await sendProdEmail({ ...res, googleOAuth2Client: OAuth2Client });
			return json({ status: 'success', message: 'Prod Email sent?' });
		}
	} catch (error) {
		console.error('Error sending email: ', error);
		return json({ status: 'error', message: 'Failed to send email' }, { status: 500 });
	}
};

async function sendProdEmail({
	to,
	subject,
	inviteLink = 'https://www.theurbanconnectionproject.org/inviteLink',
	htmlEmailContent,
	googleOAuth2Client
}: {
	to: string;
	subject: string;
	inviteLink: string;
	htmlEmailContent: any;
	googleOAuth2Client: typeof OAuth2Client;
}) {
	console.log(
		'sendProdEmail================================>',
		'to:',
		to,
		'subject:',
		subject,
		'inviteLink:',
		inviteLink,
		'htmlEmailContent:',
		htmlEmailContent
	);

	try {
		const accessToken = await googleOAuth2Client.getAccessToken();
		const mailOptions = {
			from: `Climate Effectiveness Progress Monitoring Assessment <no-reply@theurbanconnectionproject.org>`,
			to: ['robertjhoskins@gmail.com', 'thomas.wilkins@dreamcredible.com', `${to}`],
			subject:
				'Climate Effectiveness Progress Monitoring Assessment | School Admin Invite | ' + subject,
			html: generateAdminInviteEmail(htmlEmailContent, inviteLink)
		};
		const transporter = nodemailer.createTransport({
			//@ts-ignore
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'no-reply@theurbanconnectionproject.org',
				clientId: env.GOOGLE_OAUTH_CLIENT_ID,
				clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
				refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN,
				accessToken: accessToken
			}
		});
		const result = await transporter.sendMail(mailOptions);
		console.log('Prod Email sentzzzzz: ' + result.response);
	} catch (error) {
		console.error('Error sending email: ', error);
	}
}

async function sendDevEmail({
	to,
	subject,
	text,
	inviteLink
}: {
	to?: string;
	subject?: string;
	text?: string;
	inviteLink: string;
}) {
	console.log(
		'sendDevEmail================================>',
		'text:',
		text,
		'inviteLink:',
		inviteLink
	);
	try {
		const transporter = nodemailer.createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: 'e68830f4ee190c',
				pass: 'eb72e74016ac00'
			}
		});
		const info = await transporter.sendMail({
			from: '"test👻" ',
			to: `test ${to}`,
			subject: `Hello ✔ ${subject}`,
			text: 'dev mode testing...',
			html: `<a href="${inviteLink}">Hello ✔ School Admin Invite Link ${text}</a>` //just link
		});

		console.log('Dev email sent: ' + info.response);
	} catch (error) {
		console.error('Error sending Dev email: ', error);
	}
}
