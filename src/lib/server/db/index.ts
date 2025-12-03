import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import env from '../../../env';
import { dev } from '$app/environment';

export const connection = postgres(env.DATABASE_URL, {
	max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
	onnotice: env.DB_SEEDING ? () => {} : undefined
});

export const db = drizzle(connection, {
	schema,
	casing: 'snake_case'
	// logger: dev ? true : false
});

export type db = typeof db;

export default db;
