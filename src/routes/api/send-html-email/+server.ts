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

	async function main() {
		const [htmlTemplate] = await getLatestHtmlTemplateData();
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
			to: 'bar@example.com, baz@example.com', // list of receivers
			subject: 'Hello ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: generateNewUserInviteEmail(htmlTemplate.template) // html body
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
	}

	main().catch(console.error);

	return new Response();
};
async function getLatestHtmlTemplateData() {
	return await db
		.select({ template: table.htmlEmailTemplatesTable.template })
		.from(table.htmlEmailTemplatesTable)
		.orderBy(desc(table.htmlEmailTemplatesTable.createdAt), desc(table.htmlEmailTemplatesTable.id))
		.limit(1);
}
