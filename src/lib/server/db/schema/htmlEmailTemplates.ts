import { integer, jsonb, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';

const htmlEmailTemplatesEnum = pgEnum('template_type', ['admin_invite', 'assessment_invite']);

const htmlEmailTemplates = pgTable('html_email_templates', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	template: jsonb('template').notNull(), // html email template data
	type: htmlEmailTemplatesEnum('type').default('admin_invite').notNull(),
	...timestamps
});

export default htmlEmailTemplates;
