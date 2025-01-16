// /** @type {import('./$types').PageServerLoad} */
// import { db } from '$lib/server/db';
// import * as table from '$lib/server/db/schema';
// import { eq, is } from 'drizzle-orm';
// import { redirect } from '@sveltejs/kit';

// export const load = async (event) => {
// 	const { parent } = event;
// 	if (!event.locals.user) {
// 		return redirect(302, '/auth/login');
// 	}
// 	// user role?
// 	console.log('/schools PageServerLoad event.locals.user.id => ', event.locals.user.id);
// 	const [user] = await db
// 		.select()
// 		.from(table.usersTable)
// 		.where(eq(table.usersTable.id, event.locals.user.id));

// 	let data = [];
// 	if (user.role === 'school_admin') {
// 		await getSchoolForAdmin(event.locals.user.id);
// 		console.log('school_admin data => ', data);

// 		const schoolId = 123;
// 		console.log('school_admin user REDIRECT => ', user);
// 		return redirect(302, `/schools/${schoolId}`);
// 	}

// 	// if (user.role === 'super_admin') {
// 	// 	const [user] = await db
// 	// 	.select()
// 	// 	.from(table.school)
// 	// 	.where(eq(table.usersTable.id, event.locals.user.id));
// 	// console.log('super_admin user => ', user);
// 	// 	return redirect(302, `/schools/${schoolId}`);
// 	// }

// 	// if (user.role === 'school_admin') {
// 	// 	const [user] = await db
// 	// 	.select()
// 	// 	.from(table.usersTable)
// 	// 	.where(eq(table.usersTable.id, event.locals.user.id));
// 	// console.log('school_admin user => ', user);
// 	// 	return redirect(302, `/schools/${schoolId}`);
// 	// }

// 	const parentData = await parent();
// 	return {
// 		user: event.locals.user
// 	};
// };

// const getDistrictForAdmin = async (userId: string) => {
// 	return await db
// 		.select()
// 		.from(districtsTable)
// 		.innerJoin(districtAdminsTable, is(districtAdminsTable.districtId, districtsTable.id))
// 		.where(is(districtAdminsTable.userId, userId));
// };

// const getSchoolForAdmin = async (userId: string) => {
// 	const res = await db
// 		.select()
// 		.from(table.schoolsTable)
// 		.innerJoin(
// 			table.schoolAdminsTable,
// 			eq(table.schoolAdminsTable.schoolId, table.schoolsTable.userId)
// 		);
// 	console.log('res => ', res);
// 	// .innerJoin(table.schoolAdminsTable, is(table.schoolAdminsTable.schoolId, table.schoolsTable.id))
// 	// .where(is(table.schoolAdminsTable.userId, userId));

// 	// const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
// };
