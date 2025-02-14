import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sql, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	return {
		district: await getDistrictWithSchools(parseInt(event.params.districtId)),
		adminData: await getDistrictAdmin(parseInt(event.params.districtId))
	};
}) satisfies PageServerLoad;

async function getDistrictWithSchools(districtId: number) {
	const [districtsRes] = await db
		.select({
			id: table.districtsTable.id,
			name: table.districtsTable.name,
			schools: sql`COALESCE(
				json_agg(json_build_object('id', ${table.schoolsTable.id}, 'name', ${table.schoolsTable.name})) 
			  FILTER (WHERE ${table.schoolsTable.id} IS NOT NULL), 
			  '[]'
		  ) `
		})
		.from(table.districtsTable)
		.leftJoin(table.schoolsTable, eq(table.schoolsTable.districtId, table.districtsTable.id))
		.groupBy(table.districtsTable.id)
		.where(eq(table.districtsTable.id, districtId));
	console.log(districtsRes);
	return districtsRes;
}

async function getDistrictAdmin(districtId: number) {
	const [res] = await db
		.select({
			adminName: table.usersTable.name,
			adminEmail: table.usersTable.username,
			districtId: table.districtAdminsTable.id
		})
		.from(table.districtAdminsTable)
		.innerJoin(table.usersTable, eq(table.districtAdminsTable.userId, table.usersTable.id))
		.where(eq(table.districtAdminsTable.id, districtId));

	console.log('getDisctrictAdmin res => ', res);
	return res;
}
