import { eq, and, isNotNull, desc, sql, count, or } from 'drizzle-orm';
import {
	districtAdmins,
	schoolAdmins,
	schools,
	adminUserInvites,
	users,
	htmlEmailTemplates,
	districts,
	surveyQuestions,
	surveySubDomains,
	surveyDomains,
	surveyDemographics,
	surveyQuestionsResponses,
	surveys,
	surveyStatusEnum
} from '$lib/server/db/schema';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import db from './db';
import type { AdminInvite, CreateUser, UserInviteHTMLEmailTemplateType } from '$lib/schema';
import { transformSurveyData } from '$lib/utils';
import type {
	CreateDemographicsResponseInput,
	CreateQuestionResponseInput
} from '$lib/types/survey';

export async function simpleRegisterToBeDEPRICATED(
	{
		id,
		passwordHash,
		username
	}: {
		id: string;
		passwordHash: string;
		username: string; // email-based username;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	let [newUserRes] = await db
		.insert(users)
		.values({ id, username, isActive: true, passwordHash })
		.returning({ id: users.id });
	return newUserRes || null;
}

export async function findIfActiveUserExists({
	username
}: {
	username: string;
}): Promise<{ id: string; passwordHash: string; username: string } | null> {
	const [results] = await db
		.select({
			id: users.id,
			username: users.username,
			passwordHash: users.passwordHash
		})
		.from(users)
		.where(
			and(eq(users.username, username), eq(users.isActive, true), isNotNull(users.passwordHash))
		);
	return results?.passwordHash ? { ...results, passwordHash: results.passwordHash } : null;
}

export async function findUnusedInviteByInviteId({ inviteId }: { inviteId: string }) {
	const [existingUnusedInvite] = await db
		.select()
		.from(adminUserInvites)
		.where(and(eq(adminUserInvites.id, inviteId), eq(adminUserInvites.isUsed, false)));
	return existingUnusedInvite || null;
}

export async function findUnusedInviteByEmail({ userEmail }: { userEmail: string }) {
	const [existingUnusedInvite] = await db
		.select()
		.from(adminUserInvites)
		.where(and(eq(adminUserInvites.email, userEmail), eq(adminUserInvites.isUsed, false)));
	return existingUnusedInvite || null;
}

export async function checkRegisteredUserExists({
	username
}: {
	username: string;
}): Promise<boolean> {
	const results = await db
		.select()
		.from(users)
		.where(
			and(eq(users.username, username), eq(users.isActive, false), isNotNull(users.passwordHash))
		);
	return results.length > 0;
}

export async function checkAdminUserExists({ username }: { username: string }): Promise<boolean> {
	const [results] = await db
		.select({ count: count() })
		.from(users)
		.leftJoin(schoolAdmins, eq(users.id, schoolAdmins.userId))
		.leftJoin(districtAdmins, eq(users.id, districtAdmins.userId))
		.where(
			and(
				eq(users.username, username),
				or(isNotNull(schoolAdmins.userId), isNotNull(districtAdmins.userId))
			)
		);
	return results.count > 0;
}

export async function updateUserWithPassword(
	{
		userEmail,
		passwordHash
	}: {
		userEmail: string;
		passwordHash: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string }> {
	const queryBuilder = trx ? trx.update(users) : db.update(users);
	const [updatedUser] = await queryBuilder
		.set({ isActive: true, passwordHash })
		.where(eq(users.username, userEmail))
		.returning({ id: users.id });
	return updatedUser || null;
}

export async function updateRegisterInviteWithInviteeAndMarkUsed(
	{
		userEmail,
		inviteeId
	}: {
		userEmail: string;
		inviteeId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{
	id: string;
	inviteType: 'school' | 'district' | null;
	schoolId: number | null;
	districtId: number | null;
}> {
	const queryBuilder = trx ? trx.update(adminUserInvites) : db.update(adminUserInvites);
	const [inviteRes] = await queryBuilder
		.set({ isUsed: true, invitee: inviteeId })
		.where(eq(adminUserInvites.email, userEmail))
		.returning({
			id: adminUserInvites.id,
			inviteType: adminUserInvites.inviteType,
			schoolId: adminUserInvites.schoolId,
			districtId: adminUserInvites.districtId
		});
	return inviteRes || null;
}

export async function createDistrictAdmin(
	{
		userId,
		districtId
	}: {
		userId: string;
		districtId: number;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: number }> {
	const queryBuilder = trx ? trx.insert(districtAdmins) : db.insert(districtAdmins);
	const [result] = await queryBuilder
		.values({ userId, districtId: districtId })
		.returning({ id: districtAdmins.id });
	return result || null;
}

export async function createSchoolAdmin(
	{
		userId,
		schoolId
	}: {
		userId: string;
		schoolId: number;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	const queryBuilder = trx ? trx.insert(schoolAdmins) : db.insert(schoolAdmins);
	const [result] = await queryBuilder
		.values({ userId, schoolId: schoolId })
		.returning({ id: schoolAdmins.id });
	return result || null;
}

export async function createSchool(
	{
		name,
		districtId,
		createdBy
	}: {
		name: string;
		districtId: number;
		createdBy: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: number }> {
	const queryBuilder = trx ? trx.insert(schools) : db.insert(schools);
	const [result] = await queryBuilder
		.values({ name, districtId, createdBy })
		.returning({ id: schools.id });
	return result || null;
}

export async function generateQuestionnaire() {
	let res = await db
		.select({
			domain: {
				id: surveyDomains.id,
				name: surveyDomains.name,
				type: sql<'domain'>`'domain'`
			},
			subdomain: {
				id: surveySubDomains.id,
				name: surveySubDomains.name,
				description: surveySubDomains.description,
				type: sql<'sub-domain'>`'sub-domain'`
			},
			question: {
				id: surveyQuestions.id,
				text: surveyQuestions.text,
				value: sql<boolean | null>`NULL`,
				subdomainId: surveyQuestions.subDomainId
			}
		})
		.from(surveyQuestions)
		.innerJoin(surveySubDomains, eq(surveyQuestions.subDomainId, surveySubDomains.id))
		.innerJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId));

	return transformSurveyData(res);
}

export async function getLatestHtmlTemplateData(): Promise<{
	template: UserInviteHTMLEmailTemplateType;
} | null> {
	const [res] = await db
		.select({ template: htmlEmailTemplates.template })
		.from(htmlEmailTemplates)
		.orderBy(desc(htmlEmailTemplates.createdAt), desc(htmlEmailTemplates.id))
		.limit(1);
	return res ? { template: res.template as UserInviteHTMLEmailTemplateType } : null;
}

export async function updateHtmlTemplateData(data: { template: UserInviteHTMLEmailTemplateType }) {
	const htmlEmailRes = await db.insert(htmlEmailTemplates).values({ template: data }).returning();
	return htmlEmailRes || null;
}

export async function createAdminUserInvite(
	{
		inviteData
	}: {
		inviteData: AdminInvite;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{
	id: string;
	inviteType: 'school' | 'district' | null;
	schoolId: number | null;
	districtId: number | null;
}> {
	const queryBuilder = trx ? trx.insert(adminUserInvites) : db.insert(adminUserInvites);
	const [result] = await queryBuilder.values({ ...inviteData }).returning({
		id: adminUserInvites.id,
		inviteType: adminUserInvites.inviteType,
		schoolId: adminUserInvites.schoolId,
		districtId: adminUserInvites.districtId
	});
	return result || null;
}

export async function createNewUserWithDetails(
	{ id, username, name, role, phone }: CreateUser,
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string }> {
	console.log('createNewUserWithDetails ==================================> ', {
		id,
		username,
		name,
		role,
		phone
	});
	const queryBuilder = trx ? trx.insert(users) : db.insert(users);
	const [newUser] = await queryBuilder
		.values({
			id,
			username,
			name,
			role,
			phone
		})
		.returning({ id: users.id });
	return newUser || null;
}

export async function getDistrictsWithSchools() {
	const districtsRes = await db
		.select({
			id: districts.id,
			name: districts.name,
			schools: sql`COALESCE(
				json_agg(json_build_object('id', ${schools.id}, 'name', ${schools.name})) 
			  FILTER (WHERE ${schools.id} IS NOT NULL), 
			  '[]'
		  ) `
		})
		.from(districts)
		.leftJoin(schools, eq(schools.districtId, districts.id))
		.groupBy(districts.id);
	console.log(districtsRes);
	return districtsRes || null;
}

export async function getDistrictWithSchools(districtId: number) {
	const [districtsRes] = await db
		.select({
			id: districts.id,
			name: districts.name,
			schools: sql`COALESCE(
				json_agg(json_build_object('id', ${schools.id}, 'name', ${schools.name})) 
			  FILTER (WHERE ${schools.id} IS NOT NULL), 
			  '[]'
		  ) `
		})
		.from(districts)
		.leftJoin(schools, eq(schools.districtId, districts.id))
		.groupBy(districts.id)
		.where(eq(districts.id, districtId));
	console.log(districtsRes);
	return districtsRes || null;
}

export async function getDistrictAdmin(districtId: number) {
	const [res] = await db
		.select({
			adminName: users.name,
			adminEmail: users.username,
			districtId: districtAdmins.id
		})
		.from(districtAdmins)
		.innerJoin(users, eq(districtAdmins.userId, users.id))
		.where(eq(districtAdmins.id, districtId));

	console.log('getDisctrictAdmin res => ', res);
	return res || null;
}

export async function getSchoolIDForSchoolAdmin(userId: string): Promise<number> {
	const [res] = await db
		.select({ schoolId: schools.id })
		.from(schools)
		.innerJoin(schoolAdmins, eq(schoolAdmins.schoolId, schools.id))
		.where(eq(schoolAdmins.userId, userId));

	console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res?.schoolId || null;
}

export async function getSchoolsForSuperAdmin(): Promise<{ id: number; name: string }[]> {
	const res = await db.select({ id: schools.id, name: schools.name }).from(schools);

	console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res || null;
}

export async function getSchoolsForDistrictAdmin(
	userId: string
): Promise<{ id: number; name: string; districtId: number }[] | undefined> {
	const res = await db
		.select({
			id: schools.id,
			name: schools.name,
			districtId: schools.districtId
		})
		.from(schools)
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.leftJoin(districtAdmins, eq(districtAdmins.districtId, schools.districtId))
		.where(eq(districtAdmins.userId, userId)); // Use static value here to debug if needed.

	console.log('getSchoolsForDistrictAdmin res => ', res);
	return res || null;
}

export async function getSchoolForSchoolAdmin(userId: string, schoolId: number) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy
		})
		.from(schoolAdmins)
		.innerJoin(schools, eq(schoolAdmins.schoolId, schools.id))
		.where(and(eq(schoolAdmins.userId, userId), eq(schoolAdmins.schoolId, schoolId)));

	console.log('getSchoolForSchoolAdmin res => ', res);
	return res || null;
}

export async function getSchoolForSuperAdmin(schoolId: number) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy
		})
		.from(schools)
		.where(eq(schools.id, schoolId));

	console.log('getSchoolForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolForDistrictAdmin(schoolId: number) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy
		})
		.from(schools)
		.innerJoin(districtAdmins, eq(districtAdmins.districtId, schools.districtId))
		.where(eq(schools.isActive, true));

	console.log('getSchoolForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolAdmin(schoolId: number) {
	const res = await db
		.select({
			adminName: users.name,
			adminEmail: users.username,
			adminPhone: users.phone
		})
		.from(schoolAdmins)
		.innerJoin(users, eq(schoolAdmins.userId, users.id))
		.where(eq(schoolAdmins.schoolId, schoolId));

	console.log('getSchoolAdmin res => ', res);
	return res || null;
}

export async function getDistricts() {
	return (await db.select().from(districts)) || null;
}

export async function addDemographicsData(values: CreateDemographicsResponseInput) {
	console.log('addDemographicsData values => ', values);
	const [newDemo] = await db
		.insert(surveyDemographics)
		.values({ ...values })
		.onConflictDoUpdate({
			target: [surveyDemographics.surveyId, surveyDemographics.schoolId],
			set: {
				subjectTaught: sql`excluded.subject_taught`,
				yearsTeaching: sql`excluded.years_teaching`,
				updatedAt: new Date().toISOString()
			}
		})
		.returning({ id: surveyDemographics.id });

	return newDemo;
}

export async function addQuestionsData(values: CreateQuestionResponseInput) {
	console.log('addDemographicsData values => ', values);
	const [newDemoData] = await db
		.insert(surveyQuestionsResponses)
		.values([...values])
		.onConflictDoUpdate({
			target: [surveyQuestionsResponses.surveyId, surveyQuestionsResponses.questionId],
			set: {
				response: sql`excluded.response`,
				updatedAt: new Date().toISOString()
			}
		})
		.returning({ id: surveyQuestionsResponses.id });

	return newDemoData;
}

export async function setSurveyStatus({
	surveyId,
	status
}: {
	surveyId: number;
	status: 'sent' | 'started' | 'completed';
}) {
	const [result] = await db
		.update(surveys)
		.set({ status })
		.where(eq(surveys.id, surveyId))
		.returning({ id: surveys.id });

	return result || null;
}

export async function getSurveyData(schoolId: number) {
	const results = await db
		.select({ id: surveys.id, status: surveys.status })
		.from(surveys)
		.where(eq(surveys.schoolId, schoolId));

	return results || null;
}

export async function getQuestionData(schoolId: number) {
	const results = await db
		.select({ id: surveys.id, status: surveys.status })
		.from(surveys)
		.where(eq(surveys.schoolId, schoolId));

	return results || null;
}

export async function getSchoolDomainResultsData(schoolId: number) {
	const results = await db
		.select({
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			questionId: surveyQuestions.id,
			questionResponse: surveyQuestionsResponses.response,
			subId: surveySubDomains.id,
			subName: surveySubDomains.name
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.where(eq(surveys.schoolId, schoolId));

	return results || null;
}

export async function createAssessment({
	recipientName,
	recipientEmail,
	schoolId,
	sentBy
}: {
	recipientName: string;
	recipientEmail: string;
	schoolId: number;
	sentBy: string;
}): Promise<{ id: number } | null> {
	const [newSurvey] = await db
		.insert(surveys)
		.values({
			recipientName,
			recipientEmail,
			schoolId,
			sentBy
		})
		.returning({ id: surveys.id });

	return newSurvey || null;
}
