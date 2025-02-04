import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import nodemailer from 'nodemailer';
import { INITIAL_HTML_DATA } from '$lib/constants';
import { generateNewUserInviteEmail } from '$lib/utils';
import { db } from '$lib/server/db';
import { desc } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
	console.log('GET /api/send-html-email===========================================> ');
	return json({ message: 'GET /api/send-html-email' });
};

export const POST: RequestHandler = async () => {
	const transporter = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: 'e68830f4ee190c',
			pass: 'eb72e74016ac00'
		}
	});

	const sendEmail = async (to: string, subject: string, text: string) => {
		try {
			const [htmlTemplate] = await getLatestHtmlTemplateData();
			const info = await transporter.sendMail({
				from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
				to: 'bar@example.com, baz@example.com', // list of receivers
				subject: 'Hello ✔', // Subject line
				text: 'Hello world?', // plain text body
				html: generateNewUserInviteEmail(htmlTemplate.template) // html body
			});
			console.log('Email sent: ' + info.response);
		} catch (error) {
			console.error('Error sending email: ', error);
		}
	};
	await sendEmail();
};
async function getLatestHtmlTemplateData() {
	return await db
		.select({ template: table.htmlEmailTemplatesTable.template })
		.from(table.htmlEmailTemplatesTable)
		.orderBy(desc(table.htmlEmailTemplatesTable.createdAt), desc(table.htmlEmailTemplatesTable.id))
		.limit(1);
}
