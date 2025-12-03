import { pgTable, foreignKey, varchar, timestamp, boolean, unique, uniqueIndex, smallint, jsonb, index, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const assessmentStatus = pgEnum("assessment_status", ['sent', 'started', 'completed'])
export const inviteType = pgEnum("invite_type", ['school', 'district'])
export const roles = pgEnum("roles", ['super_admin', 'district_admin', 'school_admin'])
export const templateType = pgEnum("template_type", ['admin_invite', 'assessment_invite'])


export const assessmentInvites = pgTable("assessment_invites", {
	id: varchar().primaryKey().notNull(),
	schoolId: varchar("school_id", { length: 26 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdBy: varchar("created_by"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "assessment_invites_created_by_users_id_fk"
		}),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "assessment_invites_school_id_schools_id_fk"
		}),
]);

export const assessmentQuestions = pgTable("assessment_questions", {
	id: varchar().primaryKey().notNull(),
	text: varchar().notNull(),
	subDomainId: varchar("sub_domain_id", { length: 26 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.subDomainId],
			foreignColumns: [assessmentSubDomains.id],
			name: "assessment_questions_sub_domain_id_assessment_sub_domains_id_fk"
		}),
	unique("assessment_questions_text_unique").on(table.text),
]);

export const assessmentQuestionsResponses = pgTable("assessment_questions_responses", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	assessmentId: varchar("assessment_id", { length: 26 }).notNull(),
	questionId: varchar("question_id", { length: 26 }).notNull(),
	isValidSubdomainGroup: boolean("is_valid_subdomain_group").default(false),
	response: smallint(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	uniqueIndex("assessmentId_qId_idx").using("btree", table.assessmentId.asc().nullsLast().op("text_ops"), table.questionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "assessment_questions_responses_assessment_id_assessments_id_fk"
		}),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [assessmentQuestions.id],
			name: "assessment_questions_responses_question_id_assessment_questions"
		}),
]);

export const assessmentDomains = pgTable("assessment_domains", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const assessmentSubDomains = pgTable("assessment_sub_domains", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar().notNull(),
	domainId: varchar("domain_id", { length: 26 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.domainId],
			foreignColumns: [assessmentDomains.id],
			name: "assessment_sub_domains_domain_id_assessment_domains_id_fk"
		}),
	unique("assessment_sub_domains_name_unique").on(table.name),
]);

export const htmlEmailTemplates = pgTable("html_email_templates", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	template: jsonb().notNull(),
	type: templateType().default('admin_invite').notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const districtAdmins = pgTable("district_admins", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 26 }).notNull(),
	districtId: varchar("district_id", { length: 26 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "district_admins_district_id_districts_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "district_admins_user_id_users_id_fk"
		}),
	unique("district_admins_userId_unique").on(table.userId),
]);

export const schoolAdmins = pgTable("school_admins", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 26 }).notNull(),
	schoolId: varchar("school_id", { length: 26 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "school_admins_school_id_schools_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "school_admins_user_id_users_id_fk"
		}),
]);

export const sessions = pgTable("sessions", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 26 }).notNull(),
	currentSessionHasExpiresAt: boolean("current_session_has_expires_at").default(false),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 256 }),
	phone: varchar({ length: 256 }),
	username: varchar({ length: 256 }).notNull(),
	passwordHash: varchar("password_hash"),
	role: roles().default('school_admin'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	index("username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	unique("users_username_unique").on(table.username),
]);

export const adminUserInvites = pgTable("admin_user_invites", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 256 }).notNull(),
	email: varchar().notNull(),
	isSent: boolean("is_sent").default(false),
	invitee: varchar({ length: 26 }),
	inviter: varchar({ length: 26 }),
	expiration: timestamp({ mode: 'string' }).default(sql`(now() + '10 days'::interval)`).notNull(),
	isUsed: boolean("is_used").default(false).notNull(),
	role: roles().default('school_admin'),
	inviteType: inviteType("invite_type").default('school'),
	schoolId: varchar("school_id", { length: 26 }),
	districtId: varchar("district_id", { length: 26 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "admin_user_invites_district_id_districts_id_fk"
		}),
	foreignKey({
			columns: [table.invitee],
			foreignColumns: [users.id],
			name: "admin_user_invites_invitee_users_id_fk"
		}),
	foreignKey({
			columns: [table.inviter],
			foreignColumns: [users.id],
			name: "admin_user_invites_inviter_users_id_fk"
		}),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "admin_user_invites_school_id_schools_id_fk"
		}),
]);

export const schools = pgTable("schools", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	districtId: varchar("district_id", { length: 26 }).notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdBy: varchar("created_by", { length: 26 }),
	stripePaymentId: varchar("stripe_payment_id", { length: 256 }),
	stripeData: jsonb("stripe_data"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	uniqueIndex("districtSchoolNameComboUniqueIndex").using("btree", table.districtId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "schools_created_by_users_id_fk"
		}),
	foreignKey({
			columns: [table.districtId],
			foreignColumns: [districts.id],
			name: "schools_district_id_districts_id_fk"
		}),
]);

export const districts = pgTable("districts", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdBy: varchar("created_by", { length: 26 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "districts_created_by_users_id_fk"
		}),
]);

export const assessmentDemographicsResponses = pgTable("assessment_demographics_responses", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	educationLevel: varchar("education_level", { length: 64 }),
	yearsTeaching: integer("years_teaching"),
	schoolId: varchar("school_id", { length: 26 }).notNull(),
	assessmentId: varchar("assessment_id", { length: 26 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	uniqueIndex("assessmentId_schoolId_idx").using("btree", table.assessmentId.asc().nullsLast().op("text_ops"), table.schoolId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [assessments.id],
			name: "assessment_demographics_responses_assessment_id_assessments_id_"
		}),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "assessment_demographics_responses_school_id_schools_id_fk"
		}),
]);

export const assessments = pgTable("assessments", {
	id: varchar({ length: 26 }).primaryKey().notNull(),
	schoolId: varchar("school_id", { length: 26 }),
	createdBy: varchar("created_by", { length: 26 }),
	assessmentInviteId: varchar("assessment_invite_id", { length: 26 }),
	participantName: varchar("participant_name", { length: 256 }).notNull(),
	participantEmail: varchar("participant_email", { length: 256 }).notNull(),
	status: assessmentStatus().default('started').notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assessmentInviteId],
			foreignColumns: [assessmentInvites.id],
			name: "assessments_assessment_invite_id_assessment_invites_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "assessments_created_by_users_id_fk"
		}),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "assessments_school_id_schools_id_fk"
		}),
	unique("assessments_participantEmail_unique").on(table.participantEmail),
]);
