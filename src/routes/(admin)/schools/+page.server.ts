/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, is } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { schools } from '$lib/data/data';

export const load = async (event) => {
	const { parent } = event;
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	let data: any = [];

	if (event.locals.user.role === 'school_admin') {
		const schoolId = await getSchoolIDForSchoolAdmin(event.locals.user.id);

		console.log('school_admin user REDIRECT => ', event.locals.user);
		return redirect(302, `/schools/${schoolId}`);
	}
	if (event.locals.user.role === 'super_admin') {
		data = await getSchoolsForSuperAdmin();
	}

	const parentData = await parent();
	return {
		user: event.locals.user,
		schools: data
	};
};

// const getDistrictForAdmin = async (userId: string) => {
// 	return await db
// 		.select()
// 		.from(districtsTable)
// 		.innerJoin(districtAdminsTable, is(districtAdminsTable.districtId, districtsTable.id))
// 		.where(is(districtAdminsTable.userId, userId));
// };

const getSchoolIDForSchoolAdmin = async (userId: string) => {
	const [res] = await db
		.select({ schoolId: table.schoolsTable.id })
		.from(table.schoolsTable)
		.innerJoin(table.schoolAdminsTable, eq(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
		.where(eq(table.schoolAdminsTable.userId, userId));

	console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res.schoolId;
	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
	// .where(is(table.schoolAdminsTable.userId, userId));

	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
};
const getSchoolsForSuperAdmin = async () => {
	const res = await db
		.select({ id: table.schoolsTable.id, name: table.schoolsTable.name })
		.from(table.schoolsTable);

	console.log('getSchoolIDForSchoolAdmin res => ', res);
	return res;
	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
	// .where(is(table.schoolAdminsTable.userId, userId));

	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
};
