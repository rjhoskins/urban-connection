import { boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import { pgEnum } from 'drizzle-orm/pg-core';

export const inviteType = pgEnum('invite_type', ['school', 'district']);
export const userRolesEnum = pgEnum('roles', ['super_admin', 'district_admin', 'school_admin']);
export const templateType = pgEnum('template_type', ['admin_invite', 'assessment_invite']);
export const assessmentStatusEnum = pgEnum('assessment_status', ['sent', 'started', 'completed']);

export const timestamps = {
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull()
		.$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`)
};
export const softDelete = {
	isDeleted: boolean('is_deleted').default(true),
	deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull()
};
