/** @type {import('./$types').PageServerLoad} */
// import { schools } from '$lib/data/data';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth/login');
	}
	let dataFunc: () => Promise<any> = async () => {
		return null;
	};
	let adminDataFunc: () => Promise<any> = async () => {
		return null;
	};
	if (event.locals.user && event.locals.user.role === 'school_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForSchoolAdmin(userId, Number(event.params.schoolId));
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'district_admin') {
		const userId = event.locals.user.id;
		if (userId) {
			dataFunc = () => getSchoolForDistrictAdmin(Number(event.params.schoolId));
			adminDataFunc = async () => {
				if (event.locals.user) {
					return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
				}
				return null;
			};
		}
	}
	if (event.locals.user && event.locals.user.role === 'super_admin') {
		console.log('super_admin user =======================> ');
		dataFunc = () => getSchoolForSuperAdmin(Number(event.params.schoolId));
		adminDataFunc = async () => getSchoolAdmin(Number(event.params.schoolId));
		// adminDataFunc = async () => {
		// 	if (event.locals.user) {
		// 		return { adminName: event.locals.user.name, adminEmail: event.locals.user.username };
		// 	}
		// 	return null;
		// };
	}

	return {
		adminData: await adminDataFunc(),
		school: await dataFunc()
	};
};

const getSchoolForSchoolAdmin = async (userId: string, schoolId: number) => {
	const [res] = await db
		.select({
			id: table.schoolsTable.id,
			name: table.schoolsTable.name,
			createdAt: table.schoolsTable.createdAt,
			createdBy: table.schoolsTable.createdBy
		})
		.from(table.schoolAdminsTable)
		.innerJoin(table.schoolsTable, eq(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
		.where(
			and(
				eq(table.schoolAdminsTable.userId, userId),
				eq(table.schoolAdminsTable.schoolId, schoolId)
			)
		);

	console.log('getSchoolForSchoolAdmin res => ', res);
	return res;
	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
	// .where(is(table.schoolAdminsTable.userId, userId));

	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
};
const getSchoolForSuperAdmin = async (schoolId: number) => {
	const [res] = await db
		.select({
			id: table.schoolsTable.id,
			name: table.schoolsTable.name,
			createdAt: table.schoolsTable.createdAt,
			createdBy: table.schoolsTable.createdBy
		})
		.from(table.schoolsTable)
		.where(eq(table.schoolsTable.id, schoolId));

	console.log('getSchoolForSuperAdmin res => ', res);
	return res;
	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
	// .where(is(table.schoolAdminsTable.userId, userId));

	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
};
const getSchoolForDistrictAdmin = async (schoolId: number) => {
	const [res] = await db
		.select({
			id: table.schoolsTable.id,
			name: table.schoolsTable.name,
			createdAt: table.schoolsTable.createdAt,
			createdBy: table.schoolsTable.createdBy
		})
		.from(table.schoolsTable)
		.innerJoin(
			table.districtAdminsTable,
			eq(table.districtAdminsTable.districtId, table.schoolsTable.districtId)
		)
		.where(eq(table.schoolsTable.isActive, true));

	console.log('getSchoolForSuperAdmin res => ', res);
	return res;
	// 	db
	//         .select({  name: schools.name, id: schools.id,   })
	//   .from(schools)
	//            .innerJoin(districtAdmins, eq(districtAdmins.districtId, schools.districtId))
	//       .where(eq(schools.isActive, true))
	//   .limit(20))
};
const getSchoolAdmin = async (schoolId: number) => {
	const [res] = await db
		.select({
			adminName: table.usersTable.name,
			adminEmail: table.usersTable.username
		})
		.from(table.schoolAdminsTable)
		.innerJoin(table.usersTable, eq(table.schoolAdminsTable.userId, table.usersTable.id))
		.innerJoin(table.schoolsTable, eq(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
		.where(eq(table.schoolsTable.id, schoolId));

	console.log('getSchoolAdmin res => ', res);
	return res;
	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
	// .where(is(table.schoolAdminsTable.userId, userId));

	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
};
