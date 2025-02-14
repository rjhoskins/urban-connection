/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, is } from 'drizzle-orm';
import { redirect, type Actions } from '@sveltejs/kit';
import { schools } from '$lib/data/data';

export const load = async (event) => {
	const { parent } = event;
	if (!event.locals.user?.id) {
		return redirect(302, '/auth/login');
	}

	let data: any = [];
	switch (event.locals.user.role) {
		case 'school_admin': {
			const schoolId = await getSchoolIDForSchoolAdmin(event.locals.user.id);
			console.log('school_admin user REDIRECT => ', event.locals.user);
			return redirect(302, `/schools/${schoolId}`);
		}
		case 'super_admin': {
			data = await getSchoolsForSuperAdmin();
			break;
		}
		case 'district_admin': {
			data = await getSchoolsForDistrictAdmin(event.locals.user.id);
			break;
		}
		default:
			console.log('Unhandled role:', event.locals.user.role);
			break;
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
const getSchoolsForDistrictAdmin = async (userId: string) => {
	try {
		const res = await db
			.select({
				id: table.schoolsTable.id,
				name: table.schoolsTable.name,
				districtId: table.schoolsTable.districtId
			})
			.from(table.schoolsTable)
			.leftJoin(table.districtsTable, eq(table.districtsTable.id, table.schoolsTable.districtId))
			.leftJoin(
				table.districtAdminsTable,
				eq(table.districtAdminsTable.districtId, table.schoolsTable.districtId)
			)
			.where(eq(table.districtAdminsTable.userId, userId)); // Use static value here to debug if needed.

		console.log('getSchoolsForDistrictAdmin res => ', res);
		return res;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
		console.log('getSchoolsForDistrictAdmin error => ', errorMessage);
	}
};

export const actions: Actions = {
	default: async (event) => {
		console.log('default event => ', event);
		// if (!form.valid) {
		// 	return message(form, 'Invalid form');
		// }
		console.log('form => ');
		// return form;
	}
};
