import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import nodemailer from 'nodemailer';
import { INITIAL_HTML_DATA } from '$lib/constants';
import { generateNewUserInviteEmail } from '$lib/utils';
import { db } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import * as table from '$lib/server/db/schema/db-utils';
import { stat } from 'fs';

export const GET: RequestHandler = async () => {
	console.log('GET /api/send-html-email===========================================> ');
	return json({ message: 'GET /api/send-html-email', 'application/json': '' });
};

export const POST: RequestHandler = async (event) => {
	const res = await event.request.json();
	const transporter = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: 'e68830f4ee190c',
			pass: 'eb72e74016ac00'
		}
	});

	const sendEmail = async ({
		to,
		subject,
		inviteLink,
		htmlEmailContent
	}: {
		to: string;
		subject: string;
		inviteLink: string;
		htmlEmailContent: any;
	}) => {
		try {
			const info = await transporter.sendMail({
				from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
				to: `bar@example.com, baz@example.com ${to}`, // list of receivers
				subject: `Hello ✔ ${subject}`, // Subject line
				text: 'Hello world?', // plain text body
				html: generateNewUserInviteEmail(htmlEmailContent, inviteLink) // html body
			});
			console.log('Email sent: ' + info.response);
		} catch (error) {
			console.error('Error sending email: ', error);
		}
	};
	await sendEmail({ ...res });
	return json({ status: 'success', message: 'Email sent' });
};
