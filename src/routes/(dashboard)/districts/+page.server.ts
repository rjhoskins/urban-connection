import { db } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema/db-utils';
import { eq, sql, SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { PgTableWithColumns, PgColumn } from 'drizzle-orm/pg-core';
import { getDistrictsWithSchools } from '$lib/server/queries';

export const load = (async () => {
	return { districts: await getDistrictsWithSchools() };
}) satisfies PageServerLoad;
