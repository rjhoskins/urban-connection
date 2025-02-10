import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, sql, SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { PgTableWithColumns, PgColumn } from 'drizzle-orm/pg-core';

export const load = (async () => {
	return { districts: await getDistrictsWithSchools() };
}) satisfies PageServerLoad;

async function getDistrictsWithSchools() {
	const districtsRes = await db
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
		.groupBy(table.districtsTable.id);
	console.log(districtsRes);
	return districtsRes;
}
