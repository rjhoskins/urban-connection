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
	assessmentQuestions,
	assessmentSubDomains,
	assessmentDomains,
	assessmentDemographics,
	assessmentQuestionsResponses,
	assessments,
	assessmentStatusEnum
} from '$lib/server/db/schema';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { PgEnum, PgTransaction } from 'drizzle-orm/pg-core';
import db from './db';
import type { AdminInvite, CreateUser, UserInviteHTMLEmailTemplateType } from '$lib/schema';
import { transformAssessmentData } from '$lib/utils';
import type { CreateQuestionResponseInput } from '$lib/types/assessment';
import { scaleQuantile } from 'd3';
import type district from './db/schema/districts';

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
export async function updateSchoolAdminWithToken(
	{
		userId,
		token
	}: {
		userId: string;
		token: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	const queryBuilder = trx ? trx.update(schoolAdmins) : db.update(schoolAdmins);
	const [result] = await queryBuilder
		.set({ assessmentToken: token })
		.where(eq(schoolAdmins.userId, userId))
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
				id: assessmentDomains.id,
				name: assessmentDomains.name,
				type: sql<'domain'>`'domain'`
			},
			subdomain: {
				id: assessmentSubDomains.id,
				name: assessmentSubDomains.name,
				description: assessmentSubDomains.description,
				type: sql<'sub-domain'>`'sub-domain'`
			},
			question: {
				id: assessmentQuestions.id,
				text: assessmentQuestions.text,
				value: sql<boolean | null>`NULL`,
				subdomainId: assessmentQuestions.subDomainId
			}
		})
		.from(assessmentQuestions)
		.innerJoin(assessmentSubDomains, eq(assessmentQuestions.subDomainId, assessmentSubDomains.id))
		.innerJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId));

	//@ts-ignore
	return transformAssessmentData(res);
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

	if (dev) console.log('getSchoolsForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool(
	schoolId: number
): Promise<{ id: number; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: assessments.id,
			completedAt: assessments.updatedAt,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessments)
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(assessments.id, schools.id)
		.where(eq(schools.id, schoolId))
		.orderBy(assessments.createdAt);
	if (dev)
		console.log('getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool res => ', res);

	return res || null;
}

export async function getDistrictAssessmentTotals(): Promise<
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
				sql`SUM(CASE WHEN ${assessmentQuestionsResponses.isValidSubdomainGroup} = true THEN ${assessmentQuestionsResponses.response} ELSE 0 END)`.mapWith(
					Number
				),
			questionsTotal: sql`COUNT(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(districts)
		.leftJoin(schools, eq(schools.districtId, districts.id))
		.leftJoin(assessments, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(districts.id)
		.orderBy(districts.id);
	if (dev) console.log('getDistrictAssessmentTotals res => ', res);
	return res || null;
}

export async function getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminByDistrict(
	districtId: number
): Promise<{ id: number; name: string; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: schools.id,
			name: schools.name,
			assessmentCount: sql`count(distinct ${assessments.id})`.mapWith(Number),
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(schools)
		.leftJoin(assessments, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(schools.id, schools.name)
		.where(eq(schools.districtId, districtId)) // school /district /whatever
		.orderBy(schools.createdAt);
	if (dev)
		console.log('getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminByDistrict res => ', res);
	return res || null;
}

export async function getSchoolMemberAssessmentTotalsForSuperUser(
	schoolId: number
): Promise<{ id: number; name: string; pointsTotal: number; questionsTotal: number }[]> {
	const res = await db
		.select({
			id: assessments.id,
			name: assessments.participantName,
			email: assessments.participantEmail,
			completedAt: assessments.updatedAt,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessments)
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(assessments.id, schools.id)
		.where(eq(schools.id, schoolId))
		.orderBy(assessments.createdAt);
	if (dev) console.log('getSchoolMemberAssessmentTotalsForSuperUser res => ', res);
	return res || null;
}

export async function getSchoolsWithAssessmentCountAndScoreData(): Promise<
	{ id: number; name: string; assessmentCount: number }[]
> {
	const res = db
		.select({
			id: schools.id,
			name: schools.name,
			assessmentCount: sql`count(distinct ${assessments.id})`.mapWith(Number),
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(String)
		})
		.from(schools)
		.leftJoin(assessments, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(schools.id, schools.name)
		.orderBy(schools.createdAt);
	if (dev) console.log('getSchoolsWithAssessmentCountForSuperAdmin res => ', res);
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
			// createdAt: schools.createdAt,
			// createdBy: schools.createdBy,
			paid: isNotNull(schools.stripePaymentId)
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
			createdBy: districts.createdBy || null
		})
		.from(districts)
		.innerJoin(districtAdmins, eq(districtAdmins.districtId, districts.id))
		.where(eq(districtAdmins.userId, userId));

	if (dev) console.log('getLoggedInDistrictAdminsDistrict res => ', res);
	return res || null;
}

export async function getSchoolForSuperAdmin(schoolId: number) {
	const [res] = await db
		.select({
			id: schools.id,
			name: schools.name,
			createdAt: schools.createdAt,
			createdBy: schools.createdBy,
			paid: isNotNull(schools.stripePaymentId)
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
			createdBy: schools.createdBy,
			paid: isNotNull(schools.stripePaymentId)
		})
		.from(schools)
		.leftJoin(districtAdmins, eq(districtAdmins.districtId, schools.districtId))
		.where(
			and(eq(schools.isActive, true), eq(schools.id, schoolId), eq(districtAdmins.userId, userId))
		);
	if (dev) console.log('getSchoolForDistrictAdmin res => ', res);
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
	const districtsRes = await db
		.select({
			id: districts.id,
			name: districts.name,
			adminId: districtAdmins.id
		})
		.from(districts)
		.leftJoin(districtAdmins, eq(districtAdmins.districtId, districts.id));

	return districtsRes || null;
}

export async function addDemographicsData(values: CreateDemographicsResponseInput) {
	if (dev) console.log('addDemographicsData values => ', values);
	if (!values.assessmentId || !values.schoolId) {
		throw new Error('assessmentId and schoolId are required');
	}
	const [newDemo] = await db
		.insert(assessmentDemographics)
		.values({
			assessmentId: values.assessmentId,
			schoolId: values.schoolId,
			yearsTeaching: values.yearsTeaching,
			educationLevel: values.educationLevel
		})
		.onConflictDoUpdate({
			target: [assessmentDemographics.assessmentId, assessmentDemographics.schoolId],
			set: {
				educationLevel: sql`excluded.education_level`,
				yearsTeaching: sql`excluded.years_teaching`
			}
		})
		.returning({ id: assessmentDemographics.id });

	return newDemo;
}

export async function addQuestionsData(values: CreateQuestionResponseInput) {
	if (dev) console.log('addQuestionsData values => ', values);
	const [newQuestionData] = await db
		.insert(assessmentQuestionsResponses)
		.values([...values])
		.onConflictDoUpdate({
			target: [assessmentQuestionsResponses.assessmentId, assessmentQuestionsResponses.questionId],
			set: {
				assessmentId: sql`excluded.assessment_id`,
				questionId: sql`excluded.question_id`,
				isValidSubdomainGroup: sql`excluded.is_valid_subdomain_group`,
				response: sql`excluded.response`
			}
		});
	return newQuestionData;
}

export async function setAssessmentStatus({
	assessmentId,
	status
}: {
	assessmentId: number;
	status: (typeof assessmentStatusEnum.enumValues)[number];
}) {
	const [result] = await db
		.update(assessments)
		.set({ status })
		.where(eq(assessments.id, assessmentId))
		.returning({ id: assessments.id });

	return result || null;
}

export async function getAssessmentData(schoolId: number) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || [];
}
export async function getSchoolAssessmentDataWithSummaryResult(schoolId: number) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || [];
}

export async function getSchoolAssessmentResultsData(schoolId: number) {
	const results = await db
		.select({
			assessmentId: assessments.id,
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			questionId: assessmentQuestions.id,
			questionResponse: assessmentQuestionsResponses.response,
			questionisValidSubdomainGroup: assessmentQuestionsResponses.isValidSubdomainGroup,
			subDomainId: assessmentSubDomains.id,
			subName: assessmentSubDomains.name
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(assessments.schoolId, schoolId));
	return results || null;
}
export async function getSingleAssessmentResultsDataForSuperAdmin(assessmentId: number) {
	const results = await db
		.select({
			participantName: assessments.participantName,
			participantEmail: assessments.participantEmail,
			assessmentId: assessments.id,
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			questionId: assessmentQuestions.id,
			questionResponse: assessmentQuestionsResponses.response,
			questionisValidSubdomainGroup: assessmentQuestionsResponses.isValidSubdomainGroup,
			subDomainId: assessmentSubDomains.id,
			subName: assessmentSubDomains.name
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(assessments.id, assessmentId));

	return results || null;
}
export async function getSingleAssessmentResultsDataForSchoolAndDistrictAdmin(
	assessmentId: number
) {
	const results = await db
		.select({
			assessmentId: assessments.id,
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			questionId: assessmentQuestions.id,
			questionResponse: assessmentQuestionsResponses.response,
			questionisValidSubdomainGroup: assessmentQuestionsResponses.isValidSubdomainGroup,
			subDomainId: assessmentSubDomains.id,
			subName: assessmentSubDomains.name
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(assessments.id, assessmentId));

	return results || null;
}

export async function getQuestionData(schoolId: number) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || null;
}

export async function getSchoolDomainResultsData(schoolId: number) {
	const results = await db
		.select({
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			questionId: assessmentQuestions.id,
			questionResponse: assessmentQuestionsResponses.response,
			subId: assessmentSubDomains.id,
			subName: assessmentSubDomains.name
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(assessments.schoolId, schoolId));

	return results || null;
}

export async function getDistrictAdminsDistrictIdByUserId(
	userId: string
): Promise<{ districtId: number; userId: string } | null> {
	const [districtRes] = await db
		.select({ districtId: districtAdmins.districtId, userId: districtAdmins.userId })
		.from(districtAdmins)
		.leftJoin(districts, eq(districts.id, districtAdmins.districtId))
		.where(eq(districtAdmins.userId, userId));

	return districtRes || null;
}

export async function createAssessment({
	participantName,
	participantEmail,
	schoolId,
	sentBy
}: {
	participantName: string;
	participantEmail: string;
	schoolId: number;
	sentBy: string;
}): Promise<{ id: number } | null> {
	const [newAssessment] = await db
		.insert(assessments)
		.values({
			participantName,
			participantEmail,
			schoolId,
			sentBy
		})
		.returning({ id: assessments.id });

	return newAssessment || null;
}

export async function getAllTimeQuestionResponsesByDomain() {
	const results = await db
		.select({
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.groupBy(assessmentDomains.id)
		.orderBy(assessmentDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestion() {
	const results = await db
		.select({
			questionId: assessmentQuestions.id,
			domainId: assessmentSubDomains.domainId,
			questionText: assessmentQuestions.text,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.groupBy(assessmentQuestions.id, assessmentSubDomains.domainId)
		.orderBy(assessmentQuestions.id);
	return results || [];
}

export async function getAllTimeQuestionResponsesByDomainForDistrict(districtId: number) {
	const results = await db
		.select({
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(districts.id, districtId))
		.groupBy(assessmentDomains.id)
		.orderBy(assessmentDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestionForDistrict(districtId: number) {
	const results = await db
		.select({
			questionId: assessmentQuestions.id,
			domainId: assessmentSubDomains.domainId,
			questionText: assessmentQuestions.text,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(districts, eq(districts.id, schools.districtId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.where(eq(districts.id, districtId))
		.groupBy(assessmentQuestions.id, assessmentSubDomains.domainId)
		.orderBy(assessmentQuestions.id);
	return results || [];
}

export async function getAllTimeQuestionResponsesByDomainForSchool(schoolId: number) {
	const results = await db
		.select({
			domainId: assessmentDomains.id,
			domainName: assessmentDomains.name,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.leftJoin(assessmentDomains, eq(assessmentDomains.id, assessmentSubDomains.domainId))
		.where(eq(schools.id, schoolId))
		.groupBy(assessmentDomains.id)
		.orderBy(assessmentDomains.id);

	return results || [];
}

export async function getAllTimeQuestionResponsesStatsByQuestionForSchool(schoolId: number) {
	const results = await db
		.select({
			questionId: assessmentQuestions.id,
			domainId: assessmentSubDomains.domainId,
			questionText: assessmentQuestions.text,
			pointsTotal:
				sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(
					Number
				),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number)
		})
		.from(assessmentQuestionsResponses)
		.leftJoin(assessments, eq(assessments.id, assessmentQuestionsResponses.assessmentId))
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.leftJoin(assessmentSubDomains, eq(assessmentSubDomains.id, assessmentQuestions.subDomainId))
		.where(eq(schools.id, schoolId))
		.groupBy(assessmentQuestions.id, assessmentSubDomains.domainId)
		.orderBy(assessmentQuestions.id);
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

export const getAssessmentByParticipantEmail = async ({
	email,
	schoolId
}: {
	email: string;
	schoolId: number;
}) => {
	const [res] = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(and(eq(assessments.participantEmail, email), eq(assessments.schoolId, schoolId)));
	if (dev) console.log('getAssessmentByParticipantEmail => ', res);
	return res || null;
};

export const getDemographicsDataByAssessmentId = async (assessmentId: number) => {
	const [res] = await db
		.select({
			subjectTaught: assessmentDemographics.subjectTaught,
			yearsTeaching: assessmentDemographics.yearsTeaching
		})
		.from(assessmentDemographics)
		.where(eq(assessmentDemographics.assessmentId, assessmentId));
	if (dev) console.log('getDemographicsDataByAssessmentId => ', res);
	return res || null;
};

export const getAssessmentDataByAssessmentId = async (assessmentId: number) => {
	const res = await db
		.select({
			questionId: assessmentQuestionsResponses.questionId,
			response: assessmentQuestionsResponses.response
		})
		.from(assessmentQuestionsResponses)
		.where(eq(assessmentQuestionsResponses.assessmentId, assessmentId));
	if (dev) console.log('getAssessmentDataByAssessmentId => ', res);
	return res || null;
};

export async function updateSchoolStripeData({
	schoolId,
	stripePaymentId,
	stripeData
}: {
	schoolId: number;
	stripePaymentId: string | null;
	stripeData: any | null;
}) {
	if (dev)
		console.log('QUERY updateSchoolStripeData.... => ', { schoolId, stripePaymentId, stripeData });
	const [result] = await db
		.update(schools)
		.set({
			stripePaymentId,
			stripeData
		})
		.where(eq(schools.id, schoolId))
		.returning({ id: schools.id });

	return result || null;
}
