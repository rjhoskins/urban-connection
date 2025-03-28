import { eq, and, isNotNull, desc, sql, count, or, not, sum } from 'drizzle-orm';
import { dev } from '$app/environment';
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
import type { PgEnum, PgTransaction } from 'drizzle-orm/pg-core';
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
export async function findIfUserExistsById({
	username
}: {
	username: string;
}): Promise<{ id: string; username: string } | null> {
	const [user] = await db
		.select({
			id: users.id,
			username: users.username
		})
		.from(users)
		.where(eq(users.username, username));
	return user || null;
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

	//@ts-ignore
	return transformSurveyData(res);
}

export async function getHtmlTemplateTypes() {
	const hmlTemplateTypes = await db
		.select({ type: htmlEmailTemplates.type })
		.from(htmlEmailTemplates)
		.groupBy(htmlEmailTemplates.type);
	return hmlTemplateTypes || null;
}

export async function getLatestHtmlTemplateDataByType(
	type: 'admin_invite' | 'assessment_invite' | null = 'admin_invite'
) {
	const [res] = await db
		.select({ template: htmlEmailTemplates.template })
		.from(htmlEmailTemplates)
		.orderBy(desc(htmlEmailTemplates.createdAt), desc(htmlEmailTemplates.id))
		.where(eq(htmlEmailTemplates.type, type as unknown as 'admin_invite' | 'assessment_invite'))
		.limit(1);
	return res ? { template: res.template as UserInviteHTMLEmailTemplateType } : null;
}

export async function updateHtmlTemplateData({
	data,
	type = 'admin_invite'
}: {
	data: UserInviteHTMLEmailTemplateType;
	type?: 'admin_invite' | 'assessment_invite';
}) {
	const htmlEmailRes = await db
		.update(htmlEmailTemplates)
		.set({ template: data })
		.where(eq(htmlEmailTemplates.type, type as unknown as 'admin_invite' | 'assessment_invite'))
		.returning();
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
	{ id, username, name, role = 'school_admin', phone }: CreateUser,
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string }> {
	if (dev)
		console.log('createNewUserWithDetails =================> ', {
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
	if (dev) console.log(districtsRes);
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
	if (dev) console.log(districtsRes);
	return districtsRes || null;
}

export async function getDistrictAdmin(districtId: number) {
	const [res] = await db
		.select({
			adminName: users.name,
			adminPhone: users.phone,
			adminEmail: users.username
		})
		.from(districtAdmins)
		.innerJoin(users, eq(districtAdmins.userId, users.id))
		.where(eq(districtAdmins.districtId, districtId));

	if (dev) console.log('getDisctrictAdmin res => ', res);
	return res || null;
}

export async function getSchoolIDForSchoolAdmin(userId: string): Promise<number | null> {
	const [res] = await db
		.select({ schoolId: schools.id })
		.from(schools)
		.innerJoin(schoolAdmins, eq(schoolAdmins.schoolId, schools.id))
		.where(eq(schoolAdmins.userId, userId));

	if (dev) console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res?.schoolId || null;
}

export async function getSchoolsForSuperAdmin(): Promise<{ id: number; name: string }[]> {
	const res = await db.select({ id: schools.id, name: schools.name }).from(schools);

	if (dev) console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res || null;
}

export async function getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool(
	schoolId: number
): Promise<{ id: number; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: surveys.id,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveys)
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestionsResponses, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.groupBy(surveys.id, schools.id)
		.where(eq(schools.id, schoolId))
		.orderBy(surveys.createdAt);
	if (dev) console.log('getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminBySchool res => ', res);

	return res || null;
}

export async function getDistrictSurveyTotals(): Promise<
	{ id: number; pointsTotal: number; questionsTotal: number }[]
> {
	const res = await db
		.select({
			id: districts.id,
			name: districts.name,
			// memberSchoolsCount: sql`COUNT(DISTINCT ${schools.id})`.mapWith(Number),
			// memberSchoolsCount: sum(schools.id),
			memberSchoolsCount: sql`COUNT(DISTINCT ${schools.id})`.mapWith(Number),
			pointsTotal:
				sql`SUM(CASE WHEN ${surveyQuestionsResponses.isValidSubdomainGroup} = true THEN ${surveyQuestionsResponses.response} ELSE 0 END)`.mapWith(
					Number
				),
			questionsTotal: sql`COUNT(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(districts)
		.leftJoin(schools, eq(schools.districtId, districts.id))
		.leftJoin(surveys, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestionsResponses, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.groupBy(districts.id)
		.orderBy(districts.id);
	if (dev) console.log('getDistrictSurveyTotals res => ', res);
	return res || null;
}

export async function getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminByDistrict(
	districtId: number
): Promise<{ id: number; name: string; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: schools.id,
			name: schools.name,
			surveyCount: sql`count(distinct ${surveys.id})`.mapWith(Number),
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(schools)
		.leftJoin(surveys, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestionsResponses, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.groupBy(schools.id, schools.name)
		.where(eq(schools.districtId, districtId)) // school /district /whatever
		.orderBy(schools.createdAt);
	if (dev)
		console.log('getSchoolMemberSurveyTotalsForSchoolAndDistrictAdminByDistrict res => ', res);
	return res || null;
}

export async function getSchoolMemberSurveyTotalsForSuperUser(
	schoolId: number
): Promise<{ id: number; name: string; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: surveys.id,
			name: surveys.recipientName,
			email: surveys.recipientEmail,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveys)
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestionsResponses, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.groupBy(surveys.id, schools.id)
		.where(eq(schools.id, schoolId))
		.orderBy(surveys.createdAt);
	if (dev) console.log('getSchoolMemberSurveyTotalsForSuperUser res => ', res);
	return res || null;
}

export async function getSchoolsWithSurveyCountAndScoreData(): Promise<
	{ id: number; name: string; surveyCount: number }[]
> {
	const res = db
		.select({
			id: schools.id,
			name: schools.name,
			surveyCount: sql`count(distinct ${surveys.id})`.mapWith(Number),
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(String)
		})
		.from(schools)
		.leftJoin(surveys, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestionsResponses, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.groupBy(schools.id, schools.name)
		.orderBy(schools.createdAt);
	if (dev) console.log('getSchoolsWithSurveyCountForSuperAdmin res => ', res);
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

	if (dev) console.log('getSchoolsForDistrictAdmin res => ', res);
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

	if (dev) console.log('getSchoolForSchoolAdmin res => ', res);
	return res || null;
}
export async function getLoggedInSchoolAdminsSchool(userId: string) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy
		})
		.from(schoolAdmins)
		.innerJoin(schools, eq(schoolAdmins.schoolId, schools.id))
		.where(eq(schoolAdmins.userId, userId));

	if (dev) console.log('getSchoolForSchoolAdmin res => ', res);
	return res || null;
}
export async function getLoggedInDistrictAdminsDistrict(userId: string) {
	const [res] = await db
		.select({
			id: districts.id,
			name: districts.name,
			createdAt: districts.createdAt,
			createdBy: districts.createdBy
		})
		.from(districts)
		.innerJoin(districtAdmins, eq(districtAdmins.districtId, districtAdmins.id))
		.where(eq(districtAdmins.userId, userId));

	if (dev) console.log('getSchoolForSchoolAdmin res => ', res);
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

	if (dev) console.log('getSchoolForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolForDistrictAdmin(userId: string, schoolId: number) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy
		})
		.from(schools)
		.leftJoin(districtAdmins, eq(districtAdmins.districtId, schools.districtId))
		.where(
			and(eq(schools.isActive, true), eq(schools.id, schoolId), eq(districtAdmins.userId, userId))
		);
	if (dev) console.log('getSchoolForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolAdminBySchoolId(schoolId: number) {
	const res = await db
		.select({
			adminName: users.name,
			adminEmail: users.username,
			adminPhone: users.phone
		})
		.from(schoolAdmins)
		.innerJoin(users, eq(schoolAdmins.userId, users.id))
		.where(eq(schoolAdmins.schoolId, schoolId));

	if (dev) console.log('getSchoolAdmin res => ', res);
	return res || null;
}

export async function getDistricts() {
	return (await db.select().from(districts)) || null;
}

export async function addDemographicsData(values: CreateDemographicsResponseInput) {
	if (dev) console.log('addDemographicsData values => ', values);
	if (!values.surveyId || !values.schoolId) {
		throw new Error('surveyId and schoolId are required');
	}
	const [newDemo] = await db
		.insert(surveyDemographics)
		.values({
			surveyId: values.surveyId,
			schoolId: values.schoolId,
			yearsTeaching: values.yearsTeaching,
			subjectTaught: values.subjectTaught
		})
		.onConflictDoUpdate({
			target: [surveyDemographics.surveyId, surveyDemographics.schoolId],
			set: {
				subjectTaught: sql`excluded.subject_taught`,
				yearsTeaching: sql`excluded.years_teaching`
			}
		})
		.returning({ id: surveyDemographics.id });

	return newDemo;
}

export async function addQuestionsData(values: CreateQuestionResponseInput) {
	if (dev) console.log('addQuestionsData values => ', values);
	const [newQuestionData] = await db
		.insert(surveyQuestionsResponses)
		.values([...values])
		.onConflictDoUpdate({
			target: [surveyQuestionsResponses.surveyId, surveyQuestionsResponses.questionId],
			set: {
				surveyId: sql`excluded.survey_id`,
				questionId: sql`excluded.question_id`,
				isValidSubdomainGroup: sql`excluded.is_valid_subdomain_group`,
				response: sql`excluded.response`
			}
		});
	return newQuestionData;
}

export async function setSurveyStatus({
	surveyId,
	status
}: {
	surveyId: number;
	status: (typeof surveyStatusEnum.enumValues)[number];
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

	return results || [];
}
export async function getSchoolSurveyDataWithSummaryResult(schoolId: number) {
	const results = await db
		.select({ id: surveys.id, status: surveys.status })
		.from(surveys)
		.where(eq(surveys.schoolId, schoolId));

	return results || [];
}

export async function getSchoolSurveyResultsData(schoolId: number) {
	const results = await db
		.select({
			surveyId: surveys.id,
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			questionId: surveyQuestions.id,
			questionResponse: surveyQuestionsResponses.response,
			questionisValidSubdomainGroup: surveyQuestionsResponses.isValidSubdomainGroup,
			subDomainId: surveySubDomains.id,
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
export async function getSingleSurveyResultsDataForSuperAdmin(surveyId: number) {
	const results = await db
		.select({
			participantName: surveys.recipientName,
			participantEmail: surveys.recipientEmail,
			surveyId: surveys.id,
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			questionId: surveyQuestions.id,
			questionResponse: surveyQuestionsResponses.response,
			questionisValidSubdomainGroup: surveyQuestionsResponses.isValidSubdomainGroup,
			subDomainId: surveySubDomains.id,
			subName: surveySubDomains.name
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.where(eq(surveys.id, surveyId));

	return results || null;
}
export async function getSingleSurveyResultsDataForSchoolAndDistrictAdmin(surveyId: number) {
	const results = await db
		.select({
			surveyId: surveys.id,
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			questionId: surveyQuestions.id,
			questionResponse: surveyQuestionsResponses.response,
			questionisValidSubdomainGroup: surveyQuestionsResponses.isValidSubdomainGroup,
			subDomainId: surveySubDomains.id,
			subName: surveySubDomains.name
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.where(eq(surveys.id, surveyId));

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

export async function getDistrictAdminsDistrictIdByUserId(
	userId: string
): Promise<{ id: number } | null> {
	const [districtRes] = await db
		.select({ id: districtAdmins.id })
		.from(districtAdmins)
		.where(eq(districtAdmins.userId, userId));

	return districtRes || null;
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

export async function getAllTimeQuestionResponsesByDomain() {
	const results = await db
		.select({
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.groupBy(surveyDomains.id)
		.orderBy(surveyDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestion() {
	const results = await db
		.select({
			questionId: surveyQuestions.id,
			domainId: surveySubDomains.domainId,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.groupBy(surveyQuestions.id, surveySubDomains.domainId)
		.orderBy(surveyQuestions.id);
	return results || [];
}

export async function getAllTimeQuestionResponsesByDomainForDistrict(districtId: number) {
	const results = await db
		.select({
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.where(eq(districts.id, districtId))
		.groupBy(surveyDomains.id)
		.orderBy(surveyDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestionForDistrict(districtId: number) {
	const results = await db
		.select({
			questionId: surveyQuestions.id,
			domainId: surveySubDomains.domainId,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.where(eq(districts.id, districtId))
		.groupBy(surveyQuestions.id, surveySubDomains.domainId)
		.orderBy(surveyQuestions.id);
	return results || [];
}

export async function getAllTimeQuestionResponsesByDomainForSchool(schoolId: number) {
	const results = await db
		.select({
			domainId: surveyDomains.id,
			domainName: surveyDomains.name,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.leftJoin(surveyDomains, eq(surveyDomains.id, surveySubDomains.domainId))
		.where(eq(schools.id, schoolId))
		.groupBy(surveyDomains.id)
		.orderBy(surveyDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestionForSchool(schoolId: number) {
	const results = await db
		.select({
			questionId: surveyQuestions.id,
			domainId: surveySubDomains.domainId,
			pointsTotal:
				sql`sum(case when ${surveyQuestionsResponses.isValidSubdomainGroup} = true then ${surveyQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${surveyQuestionsResponses.response})`.mapWith(Number)
		})
		.from(surveyQuestionsResponses)
		.leftJoin(surveys, eq(surveys.id, surveyQuestionsResponses.surveyId))
		.leftJoin(schools, eq(schools.id, surveys.schoolId))
		.leftJoin(surveyQuestions, eq(surveyQuestions.id, surveyQuestionsResponses.questionId))
		.leftJoin(surveySubDomains, eq(surveySubDomains.id, surveyQuestions.subDomainId))
		.where(eq(schools.id, schoolId))
		.groupBy(surveyQuestions.id, surveySubDomains.domainId)
		.orderBy(surveyQuestions.id);
	return results || [];
}

export async function getDistrictDetailsById(districtId: number) {
	const [results] = await db
		.select({
			id: districts.id,
			name: districts.name
		})
		.from(districts)
		.where(eq(districts.id, districtId));

	return results || null;
}

export async function getSchoolDetailsById(
	schoolId: number,
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	const retVals = {
		id: schools.id,
		name: schools.name,
		districtId: schools.districtId
	};
	const queryBuilder = trx ? trx.select(retVals) : db.select(retVals);
	const [results] = await queryBuilder
		.from(schools)
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.where(eq(schools.id, schoolId));

	return results || null;
}

export const getSurveyById = async (surveyId: number) => {
	const [res] = await db
		.select({ id: surveys.id, status: surveys.status })
		.from(surveys)
		.where(eq(surveys.id, surveyId));
	return res || null;
};
export const getDemographicsDataBySurveyId = async (surveyId: number) => {
	const [res] = await db
		.select({
			subjectTaught: surveyDemographics.subjectTaught,
			yearsTeaching: surveyDemographics.yearsTeaching
		})
		.from(surveyDemographics)
		.where(eq(surveyDemographics.surveyId, surveyId));
	if (dev) console.log('getDemographicsDataBySurveyId => ', res);
	return res || null;
};

export const getAssessmentDataBySurveyId = async (surveyId: number) => {
	const res = await db
		.select({
			questionId: surveyQuestionsResponses.questionId,
			response: surveyQuestionsResponses.response
		})
		.from(surveyQuestionsResponses)
		.where(eq(surveyQuestionsResponses.surveyId, surveyId));
	if (dev) console.log('getAssessmentDataBySurveyId => ', res);
	return res || null;
};
