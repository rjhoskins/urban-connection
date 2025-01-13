import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/server/db/schema';
import { reset, seed } from 'drizzle-seed';
import postgres from 'postgres';

async function main() {
	console.log('Seeding database...');
	// const queryClient = postgres(process.env.DATABASE_URL!);
	const queryClient = postgres(process.env.DATABASE_URL!);
	let db = drizzle({ client: queryClient });
	const result = await db.execute('select 1');

	// db = drizzle(process.env.DATABASE_URL!);
	db = drizzle(process.env.LOCAL_DATABASE_URL!);

	// await reset(db, schema.districtsTable);
	await seed(db, schema.districtsTable);
	// console.log('Districts:', districts);
	console.log('Seeding database FINISHED...');
}

main();

// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL
// });
// const db = drizzle(pool);

// async function main() {
// 	console.log('Seeding database...');
// 	for (let i = 0; i < 10; i++) {}
// 	console.log('Seeding database FINISHED...');
// 	process.exit(0);
// }
// main()
// 	.then()
// 	.catch((err) => {
// 		console.error(err);
// 		process.exit(1);
// 	});
