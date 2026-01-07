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
	assessmentStatusEnum,
	assessmentInvites
} from '$lib/server/db/schema';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { PgEnum, PgTransaction } from 'drizzle-orm/pg-core';
import db from './db';
import type { AdminInvite, CreateUser, UserInviteHTMLEmailTemplateType } from '$lib/schema';
import { logIfDev, transformAssessmentData } from '$lib/utils';
import { admin } from 'googleapis/build/src/apis/admin';

export async function simpleRegisterToBeDEPRICATED(
	{
		passwordHash,
		username
	}: {
		passwordHash: string;
		username: string; // email-based username;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	let [newUserRes] = await db
		.insert(users)
		.values({ username, isActive: true, passwordHash })
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

export async function updateAdminInviteAsSent(
	{
		inviteId
	}: {
		inviteId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{
	id: string;
}> {
	const queryBuilder = trx ? trx.update(adminUserInvites) : db.update(adminUserInvites);
	const [inviteRes] = await queryBuilder
		.set({ isSent: true })
		.where(eq(adminUserInvites.id, inviteId))
		.returning({
			id: adminUserInvites.id
		});
	logIfDev('updateAdminInviteAsSent inviteRes => ', inviteRes);
	return inviteRes || null;
}

export async function updateAdminInviteWithInviteeAndMarkUsed(
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
	schoolId: string | null;
	districtId: string | null;
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
	logIfDev('updateAdminInviteWithInviteeAndMarkUsed inviteRes => ', inviteRes);
	return inviteRes || null;
}

export async function createDistrictAdmin(
	{
		userId,
		districtId
	}: {
		userId: string;
		districtId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string } | null> {
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
		schoolId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	const queryBuilder = trx ? trx.insert(schoolAdmins) : db.insert(schoolAdmins);
	const [result] = await queryBuilder
		.values({ userId, schoolId: schoolId })
		.returning({ id: schoolAdmins.id });
	return result || null;
}

const adminInviteReturningSelect = {
	adminInviteId: adminUserInvites.id,
	name: adminUserInvites.name,
	email: adminUserInvites.email
};

export const getUnusedAdminInviteById = async (
	{ inviteId }: { inviteId: string },
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) => {
	const retVals = {
		...adminInviteReturningSelect,
		schoolId: adminUserInvites.schoolId,
		districtId: adminUserInvites.districtId
	} as const;
	const queryBuilder = trx ? trx.select(retVals) : db.select(retVals);
	const [res] = await queryBuilder
		.from(adminUserInvites)
		.where(and(eq(adminUserInvites.id, inviteId), eq(adminUserInvites.isUsed, false)));
	logIfDev('getUnusedAdminInviteById res => ', res);
	return res || null;
};
export const getUnusedAdminInviteByEmail = async (
	{ email }: { email: string },
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) => {
	const retVals = {
		...adminInviteReturningSelect,
		schoolId: adminUserInvites.schoolId,
		districtId: adminUserInvites.districtId
	} as const;
	const queryBuilder = trx ? trx.select(retVals) : db.select(retVals);
	const [res] = await queryBuilder
		.from(adminUserInvites)
		.where(and(eq(adminUserInvites.email, email), eq(adminUserInvites.isUsed, false)));
	logIfDev('getUnusedAdminInviteById res => ', res);
	return res || null;
};

export async function createSchool(
	{
		name,
		districtId,
		createdBy
	}: {
		name: string;
		districtId: string;
		createdBy: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string } | null> {
	const queryBuilder = trx ? trx.insert(schools) : db.insert(schools);
	const [result] = await queryBuilder
		.values({ name, districtId, createdBy })
		.returning({ id: schools.id });
	return result || null;
}

export async function generateQuestionnaire() {
	const generateQuestionnaireRes = await db
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
	const transformedAssessmentQuestionsResponses = transformAssessmentData(generateQuestionnaireRes);
	// if (dev) console.log('question data', transformedAssessmentQuestionsResponses);
	return transformedAssessmentQuestionsResponses || null;

	//@ts-ignore
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

export async function findUnusedAdminUserInviteByEmailAndSchoolId(
	{
		email,
		schoolId
	}: {
		email: string;
		schoolId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{
	id: string;
	inviteType: 'school' | 'district' | null;
	schoolId: string | null;
	districtId: string | null;
}> {
	const queryBuilder = trx
		? trx.select({
				id: adminUserInvites.id,
				inviteType: adminUserInvites.inviteType,
				schoolId: adminUserInvites.schoolId,
				districtId: adminUserInvites.districtId
			})
		: db.select({
				id: adminUserInvites.id,
				inviteType: adminUserInvites.inviteType,
				schoolId: adminUserInvites.schoolId,
				districtId: adminUserInvites.districtId
			});
	const [result] = await queryBuilder
		.from(adminUserInvites)
		.where(
			and(
				eq(adminUserInvites.email, email),
				eq(adminUserInvites.schoolId, schoolId),
				eq(adminUserInvites.isUsed, false)
			)
		);
	return result || null;
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
	schoolId: string | null;
	districtId: string | null;
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
	{ username, name, role = 'school_admin', phone }: CreateUser,
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string } | null> {
	const queryBuilder = trx ? trx.insert(users) : db.insert(users);
	const [newUser] = await queryBuilder
		.values({
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
			  '[]'::json
		  ) `
		})
		.from(districts)
		.leftJoin(schools, eq(schools.districtId, districts.id))
		.groupBy(districts.id);
	if (dev) console.log(districtsRes);
	return districtsRes || null;
}

export async function getDistrictWithSchools(districtId: string) {
	const [distinctWithSchoolsRes] = await db.query.districts.findMany({
		where: eq(districts.id, districtId),
		with: {
			schools: true
		}
	});
	return distinctWithSchoolsRes || null;
}

export async function getDistrictAdmin(districtId: string) {
	const res = await db.query.districtAdmins.findFirst({
		where: eq(districtAdmins.districtId, districtId),
		columns: { id: true },
		with: {
			user: { columns: { name: true, phone: true, username: true } }
		}
	});
	if (dev) console.log('getSchoolByIdWithAdmins res => ', res);
	return res || null;
	// const [res] = await db
	// 	.select({
	// 		name: users.name,
	// 		user:
	// 		phone: users.phone,
	// 		email: users.username
	// 	})
	// 	.from(districtAdmins)
	// 	.innerJoin(users, eq(districtAdmins.userId, users.id))
	// 	.where(eq(districtAdmins.districtId, districtId));

	// if (dev) console.log('getDisctrictAdmin res => ', res);
	// return res || null;
}

export async function getSchoolById({ id }: { id: string }): Promise<{ schoolId: string } | null> {
	const [res] = await db.select({ schoolId: schools.id }).from(schools).where(eq(schools.id, id));
	if (dev) console.log('getSchoolById res => ', res);
	return res || null;
}

export async function getSchoolDataById({ id }: { id: string }): Promise<
	| {
			schoolId: string;
			schoolName: string;
			admins: { id: string; name: string; email: string; phone: string }[];
	  }[]
	| null
> {
	const res = await db
		.select({
			schoolId: schools.id,
			schoolName: schools.name,
			paid: isNotNull(schools.stripePaymentId),
			admins: sql`COALESCE(
			json_agg(json_build_object('id', ${users.id}, 'name', ${users.name}, 'email', ${users.username}, 'phone', ${users.phone})) 
		  FILTER (WHERE ${users.id} IS NOT NULL), 
		  '[]'::json
	  ) `
		})
		.from(schools)
		.where(eq(schools.id, id))
		.innerJoin(schoolAdmins, eq(schoolAdmins.schoolId, schools.id))
		.innerJoin(users, eq(schoolAdmins.userId, users.id))
		.groupBy(schools.id);

	if (dev) console.log('getSchoolById res => ', res);
	return res || null;
}
export async function getSchoolByIdWithAdmins({ id }: { id: string }): Promise<{
	id: string;
	name: string;
	districtId: string;
	isPaid: unknown;
	admins: {
		id: string;
		user: {
			name: string | null;
			phone: string | null;
			username: string;
		};
	}[];
	assessments: {
		id: string;
		status: 'sent' | 'started' | 'completed';
	}[];
} | null> {
	const res = await db.query.schools.findFirst({
		where: eq(schools.id, id),
		columns: { id: true, name: true, districtId: true },
		extras: { isPaid: isNotNull(schools.stripePaymentId).as('is_paid') },
		with: {
			admins: {
				columns: { id: true },
				with: { user: { columns: { name: true, phone: true, username: true } } }
			},
			assessments: { columns: { id: true, status: true } }
		}
	});
	return res || null;
}

export async function getSchoolByAdminId({ userId }: { userId: string }) {
	const [res] = await db
		.select({
			id: schools.id
		})
		.from(schools)
		.innerJoin(schoolAdmins, eq(schoolAdmins.schoolId, schools.id))
		.innerJoin(users, eq(schoolAdmins.userId, users.id))
		.where(eq(schoolAdmins.userId, userId));
	logIfDev('getSchoolByAdminId res => ', res);
	return res || null;
}

export async function getSchoolsForSuperAdmin(): Promise<{ id: string; name: string }[]> {
	const res = await db.select({ id: schools.id, name: schools.name }).from(schools);

	if (dev) console.log('getSchoolsForSuperAdmin res => ', res);
	return res || null;
}

export async function getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminBySchool(
	schoolId: string
): Promise<{ id: string; pointsTotal: number; questionsTotal: number }[]> {
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
	{ id: string; pointsTotal: number; questionsTotal: number }[]
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

export async function getSchoolMemberAssessmentTotalsForSchoolBySchoolId(id: string): Promise<
	| {
			id: string;
			name: string;
			assessmentCount: number;
			pointsTotal: number;
			questionsTotal: number;
			completedAt: string;
			status: (typeof assessmentStatusEnum.enumValues)[number];
	  }[]
	| null
> {
	const res = await db
		.select({
			id: assessments.id,
			name: assessments.participantName,
			assessmentCount: sql`count(distinct ${assessments.id})`.mapWith(Number),
			pointsTotal: sql`sum(case when ${assessmentQuestionsResponses.isValidSubdomainGroup} = true
				 then ${assessmentQuestionsResponses.response} else 0 end)`.mapWith(Number),
			questionsTotal: sql`count(${assessmentQuestionsResponses.response})`.mapWith(Number),
			completedAt: assessments.updatedAt,
			status: assessments.status
		})
		.from(assessments)
		.leftJoin(schools, eq(schools.id, assessments.schoolId))
		.where(eq(assessments.schoolId, id))
		.leftJoin(
			assessmentQuestionsResponses,
			eq(assessments.id, assessmentQuestionsResponses.assessmentId)
		)
		.leftJoin(
			assessmentQuestions,
			eq(assessmentQuestions.id, assessmentQuestionsResponses.questionId)
		)
		.groupBy(assessments.id, schools.id)
		.orderBy(assessments.createdAt);

	logIfDev('getSchoolMemberAssessmentTotalsForSchoolBySchoolId res => ', res);
	return res || null;
}

export async function getSchoolMemberAssessmentTotalsForSchoolAndDistrictAdminByDistrict(
	districtId: string
): Promise<{ id: string; name: string; pointsTotal: number; questionsTotal: number }[]> {
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
	schoolId: string
): Promise<{ id: string; name: string; pointsTotal: number; questionsTotal: number }[]> {
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
	{ id: string; name: string; assessmentCount: number }[]
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
): Promise<{ id: string; name: string; districtId: string }[] | undefined> {
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

export async function getSchoolForSchoolAdmin({ userId, id }: { userId: string; id: string }) {
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
		.where(and(eq(schoolAdmins.userId, userId), eq(schoolAdmins.id, id)));

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

const getDistrictSelect = {
	id: districts.id,
	name: districts.name
};

export async function getLoggedInDistrictAdminsDistrict(userId: string) {
	const res = await db
		.select(getDistrictSelect)
		.from(districts)
		.innerJoin(districtAdmins, eq(districtAdmins.districtId, districts.id))
		.where(eq(districtAdmins.userId, userId));

	if (dev) console.log('getLoggedInDistrictAdminsDistrict res => ', res);
	return res || null;
}
export async function getLoggedInSuperAdminsDistrict() {
	const res = await db.query.districts.findMany({
		columns: { id: true, name: true },
		with: {
			schools: {
				columns: { id: true, name: true }
			}
		}
	});

	if (dev) console.log('getLoggedInSuperAdminsDistrict res => ', res);
	return res || null;
}

export async function getSchoolForSuperAdmin(schoolId: string) {
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

export async function getSchoolForDistrictAdmin(userId: string, schoolId: string) {
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

export async function getSchoolAdminBySchoolId({ id }: { id: string }) {
	const res = await db
		.select({
			adminName: users.name,
			adminEmail: users.username,
			adminPhone: users.phone
		})
		.from(schoolAdmins)
		.innerJoin(users, eq(schoolAdmins.userId, users.id))
		.where(eq(schoolAdmins.schoolId, id));

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

export async function createDemographicsData(
	{
		assessmentId,
		schoolId,
		yearsTeaching,
		educationLevel
	}: {
		assessmentId: string;
		schoolId: string;
		yearsTeaching: number;
		educationLevel: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
) {
	const queryBuilder = trx ? trx.insert(assessmentDemographics) : db.insert(assessmentDemographics);
	const [newDemo] = await queryBuilder
		.values({
			assessmentId,
			schoolId,
			yearsTeaching,
			educationLevel
		})
		.returning({ id: assessmentDemographics.id });

	return newDemo;
}

export async function addQuestionsData(values: any) {
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
	assessmentId: string;
	status: (typeof assessmentStatusEnum.enumValues)[number];
}) {
	const [result] = await db
		.update(assessments)
		.set({ status })
		.where(eq(assessments.id, assessmentId))
		.returning({ id: assessments.id });

	return result || null;
}

export async function getAssessmentDataBySchoolId(schoolId: string) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || [];
}
export async function getSchoolAssessmentDataWithSummaryResult(schoolId: string) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status, completedAt: assessments.updatedAt })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || [];
}

export async function getSchoolAssessmentResultsData(schoolId: string) {
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
export async function getSingleAssessmentResultsDataForSuperAdmin(assessmentId: string) {
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
	assessmentId: string
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

export async function getQuestionData(schoolId: string) {
	const results = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.schoolId, schoolId));

	return results || null;
}

export async function getSchoolDomainResultsData(schoolId: string) {
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
): Promise<{ districtId: string; userId: string } | null> {
	const [districtRes] = await db
		.select({ districtId: districtAdmins.districtId, userId: districtAdmins.userId })
		.from(districtAdmins)
		.leftJoin(districts, eq(districts.id, districtAdmins.districtId))
		.where(eq(districtAdmins.userId, userId));

	return districtRes || null;
}

export async function createAssessmentInvite({
	schoolId,
	createdBy
}: {
	schoolId: string;
	createdBy: string;
}): Promise<{ id: string } | null> {
	const [newAssessmentInvite] = await db
		.insert(assessmentInvites)
		.values({
			schoolId,
			createdBy
		})
		.returning({ id: assessmentInvites.id });
	logIfDev('createAssessmentInvite newAssessmentInvite => ', newAssessmentInvite);
	return newAssessmentInvite || null;
}
export async function getAssessmentInviteById({
	id
}: {
	id: string;
}): Promise<{ id: string; schoolId: string; createdBy: string | null } | null> {
	const currAssessment = await db.query.assessmentInvites.findFirst({
		where: eq(assessmentInvites.id, id),
		columns: { id: true, schoolId: true, createdBy: true }
	});
	logIfDev('getAssessmentInviteById currAssessment => ', currAssessment);
	return currAssessment || null;
}
export async function createAssessment(
	{
		participantName,
		participantEmail,
		schoolId,
		createdBy,
		assessmentInviteId
	}: {
		participantName: string;
		participantEmail: string;
		schoolId: string;
		createdBy: string;
		assessmentInviteId: string;
	},
	trx?: PgTransaction<PostgresJsQueryResultHKT, any, any>
): Promise<{ id: string } | null> {
	logIfDev('START createAssessment newAssessment => ');
	const queryBuilder = trx ? trx.insert(assessments) : db.insert(assessments);
	const [newAssessment] = await queryBuilder
		.values({
			participantName,
			participantEmail,
			schoolId,
			createdBy,
			assessmentInviteId
			// status: 'started' is default
		})
		.returning({ id: assessments.id });
	logIfDev('createAssessment newAssessment => ', newAssessment);
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

export async function getAllTimeQuestionResponsesByDomainForDistrict(districtId: string) {
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

export async function getAllTimeQuestionResponsesStatsByQuestionForDistrict(districtId: string) {
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

export async function getAllTimeQuestionResponsesByDomainForSchool(schoolId: string) {
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

export async function getAllTimeQuestionResponsesStatsByQuestionForSchool(schoolId: string) {
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

export async function getDistrictDetailsById(districtId: string) {
	const [results] = await db
		.select(getDistrictSelect)
		.from(districts)
		.where(eq(districts.id, districtId));

	return results || null;
}

export async function getSchoolDetailsById(
	schoolId: string,
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

export const getAssessmentById = async ({ id }: { id: string }) => {
	const [res] = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.id, id));
	if (dev) console.log('getAssessmentById => ', res);
	return res || null;
};
export const getAssessmentByParticipantEmail = async ({ email }: { email: string }) => {
	const [res] = await db
		.select({ id: assessments.id, status: assessments.status })
		.from(assessments)
		.where(eq(assessments.participantEmail, email));
	if (dev) console.log('getAssessmentByParticipantEmail => ', res);
	return res || null;
};

export const getDemographicsDataByAssessmentId = async (assessmentId: string) => {
	const [res] = await db
		.select({
			subjectTaught: assessmentDemographics.educationLevel,
			yearsTeaching: assessmentDemographics.yearsTeaching
		})
		.from(assessmentDemographics)
		.where(eq(assessmentDemographics.assessmentId, assessmentId));
	if (dev) console.log('getDemographicsDataByAssessmentId => ', res);
	return res || null;
};

export const getAssessmentDataByAssessmentId = async (assessmentId: string) => {
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
	schoolId: string;
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
