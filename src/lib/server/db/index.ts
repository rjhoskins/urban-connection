import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
// import { districtsTable } from './schema';
// const districts = await getDistricts();
// console.log('connection test => (one) ', districts);

// async function getDistricts() {
// 	return await db.select().from(districtsTable).limit(1);
// }
