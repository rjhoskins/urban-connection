import { integer, jsonb, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './db-utils';
import { ulid } from 'ulid';

const htmlEmailTemplatesEnum = pgEnum('template_type', ['admin_invite']);

const htmlEmailTemplates = pgTable('html_email_templates', {
	id: varchar('id', { length: 26 })
		.$defaultFn(() => ulid())
		.primaryKey(),
	template: jsonb('template').notNull(), // html email template data
	type: htmlEmailTemplatesEnum('type').default('admin_invite').notNull(),
	...timestamps
});

export default htmlEmailTemplates;
