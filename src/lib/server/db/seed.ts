import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);
import * as table from '$lib/server/db/schema';

async function seed() {
	console.log('🌱 Starting seed...');

	setTimeout(() => {}, 1000); // Wait for the database to connect
	// Clear existing data
	//   await db.delete(comments);
	//   await db.delete(posts);
	//   await db.delete(users);

	// Create users
	//   const userIds = [];
	//   for (let i = 0; i < 10; i++) {
	//     const [user] = await db.insert(users).values({
	//       email: faker.internet.email(),
	//       name: faker.person.fullName(),
	//       createdAt: faker.date.past(),
	//       updatedAt: new Date(),
	//     }).returning();
	//     userIds.push(user.id);
	//   }

	// Create posts
	//   const postIds = [];
	//   for (let i = 0; i < 50; i++) {
	//     const [post] = await db.insert(posts).values({
	//       title: faker.lorem.sentence(),
	//       content: faker.lorem.paragraphs(),
	//       authorId: faker.helpers.arrayElement(userIds),
	//       published: faker.datatype.boolean(),
	//       createdAt: faker.date.past(),
	//       updatedAt: new Date(),
	//     }).returning();
	//     postIds.push(post.id);
	//   }

	// Create comments
	//   for (let i = 0; i < 100; i++) {
	//     await db.insert(comments).values({
	//       content: faker.lorem.paragraph(),
	//       authorId: faker.helpers.arrayElement(userIds),
	//       postId: faker.helpers.arrayElement(postIds),
	//       createdAt: faker.date.past(),
	//       updatedAt: new Date(),
	//     });
	//   }

	console.log('✅ Seed completed!');
}

seed().catch((error) => {
	console.error('❌ Seed failed!');
	console.error(error);
	process.exit(1);
});
