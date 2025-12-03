import { relations } from "drizzle-orm/relations";
import { users, assessmentInvites, schools, assessmentSubDomains, assessmentQuestions, assessments, assessmentQuestionsResponses, assessmentDomains, districts, districtAdmins, schoolAdmins, sessions, adminUserInvites, assessmentDemographicsResponses } from "./schema";

export const assessmentInvitesRelations = relations(assessmentInvites, ({one, many}) => ({
	user: one(users, {
		fields: [assessmentInvites.createdBy],
		references: [users.id]
	}),
	school: one(schools, {
		fields: [assessmentInvites.schoolId],
		references: [schools.id]
	}),
	assessments: many(assessments),
}));

export const usersRelations = relations(users, ({many}) => ({
	assessmentInvites: many(assessmentInvites),
	districtAdmins: many(districtAdmins),
	schoolAdmins: many(schoolAdmins),
	sessions: many(sessions),
	adminUserInvites_invitee: many(adminUserInvites, {
		relationName: "adminUserInvites_invitee_users_id"
	}),
	adminUserInvites_inviter: many(adminUserInvites, {
		relationName: "adminUserInvites_inviter_users_id"
	}),
	schools: many(schools),
	districts: many(districts),
	assessments: many(assessments),
}));

export const schoolsRelations = relations(schools, ({one, many}) => ({
	assessmentInvites: many(assessmentInvites),
	schoolAdmins: many(schoolAdmins),
	adminUserInvites: many(adminUserInvites),
	user: one(users, {
		fields: [schools.createdBy],
		references: [users.id]
	}),
	district: one(districts, {
		fields: [schools.districtId],
		references: [districts.id]
	}),
	assessmentDemographicsResponses: many(assessmentDemographicsResponses),
	assessments: many(assessments),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({one, many}) => ({
	assessmentSubDomain: one(assessmentSubDomains, {
		fields: [assessmentQuestions.subDomainId],
		references: [assessmentSubDomains.id]
	}),
	assessmentQuestionsResponses: many(assessmentQuestionsResponses),
}));

export const assessmentSubDomainsRelations = relations(assessmentSubDomains, ({one, many}) => ({
	assessmentQuestions: many(assessmentQuestions),
	assessmentDomain: one(assessmentDomains, {
		fields: [assessmentSubDomains.domainId],
		references: [assessmentDomains.id]
	}),
}));

export const assessmentQuestionsResponsesRelations = relations(assessmentQuestionsResponses, ({one}) => ({
	assessment: one(assessments, {
		fields: [assessmentQuestionsResponses.assessmentId],
		references: [assessments.id]
	}),
	assessmentQuestion: one(assessmentQuestions, {
		fields: [assessmentQuestionsResponses.questionId],
		references: [assessmentQuestions.id]
	}),
}));

export const assessmentsRelations = relations(assessments, ({one, many}) => ({
	assessmentQuestionsResponses: many(assessmentQuestionsResponses),
	assessmentDemographicsResponses: many(assessmentDemographicsResponses),
	assessmentInvite: one(assessmentInvites, {
		fields: [assessments.assessmentInviteId],
		references: [assessmentInvites.id]
	}),
	user: one(users, {
		fields: [assessments.createdBy],
		references: [users.id]
	}),
	school: one(schools, {
		fields: [assessments.schoolId],
		references: [schools.id]
	}),
}));

export const assessmentDomainsRelations = relations(assessmentDomains, ({many}) => ({
	assessmentSubDomains: many(assessmentSubDomains),
}));

export const districtAdminsRelations = relations(districtAdmins, ({one}) => ({
	district: one(districts, {
		fields: [districtAdmins.districtId],
		references: [districts.id]
	}),
	user: one(users, {
		fields: [districtAdmins.userId],
		references: [users.id]
	}),
}));

export const districtsRelations = relations(districts, ({one, many}) => ({
	districtAdmins: many(districtAdmins),
	adminUserInvites: many(adminUserInvites),
	schools: many(schools),
	user: one(users, {
		fields: [districts.createdBy],
		references: [users.id]
	}),
}));

export const schoolAdminsRelations = relations(schoolAdmins, ({one}) => ({
	school: one(schools, {
		fields: [schoolAdmins.schoolId],
		references: [schools.id]
	}),
	user: one(users, {
		fields: [schoolAdmins.userId],
		references: [users.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const adminUserInvitesRelations = relations(adminUserInvites, ({one}) => ({
	district: one(districts, {
		fields: [adminUserInvites.districtId],
		references: [districts.id]
	}),
	user_invitee: one(users, {
		fields: [adminUserInvites.invitee],
		references: [users.id],
		relationName: "adminUserInvites_invitee_users_id"
	}),
	user_inviter: one(users, {
		fields: [adminUserInvites.inviter],
		references: [users.id],
		relationName: "adminUserInvites_inviter_users_id"
	}),
	school: one(schools, {
		fields: [adminUserInvites.schoolId],
		references: [schools.id]
	}),
}));

export const assessmentDemographicsResponsesRelations = relations(assessmentDemographicsResponses, ({one}) => ({
	assessment: one(assessments, {
		fields: [assessmentDemographicsResponses.assessmentId],
		references: [assessments.id]
	}),
	school: one(schools, {
		fields: [assessmentDemographicsResponses.schoolId],
		references: [schools.id]
	}),
}));