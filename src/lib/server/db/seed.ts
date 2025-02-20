import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);

import { TEST_RUBRIC_DATA2, RUBRIC_DATA, TEST_RUBRIC_DATA } from '$lib/constants';
import { surveyDomains, surveyQuestions, surveySubDomains } from './schema';

const data = TEST_RUBRIC_DATA;

async function seed() {
	console.log('🌱 Starting seed...');
	// Clear existing data
	await db.delete(surveyQuestions);
	await db.delete(surveySubDomains);
	await db.delete(surveyDomains);

	let currDomain;
	let currSubDomain;
	let currDescriptor;

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].subDomains.length; j++) {
			for (let k = 0; k < data[i].subDomains[j].descriptors.length; k++) {
				const possibleDomain = await createDomainIfNotExists(data[i].name);
				if (!possibleDomain?.id) {
					console.error(`❌ Domain exists: ${data[i].name}`);
				} else {
					currDomain = possibleDomain;
				}
				const possibleSubDomain = await createSubDomainIfNotExists({
					description: data[i].subDomains[j].description,
					name: data[i].subDomains[j].name,
					domainId: currDomain?.id!
				});
				if (!possibleSubDomain?.id) {
					console.error(`❌ Sub-domain exists: ${data[i].subDomains[j].name}`);
				} else {
					console.log(`🌱 SubDomain created: ${data[i].subDomains[j].name}`);
					currSubDomain = possibleSubDomain;
				}
				currDescriptor = await createQuestionIfNotExists({
					text: data[i].subDomains[j].descriptors[k],
					subDomainId: currSubDomain?.id!
				});
				console.log(
					`🌱 Descriptor created id:${currDescriptor.id} => ${data[i].subDomains[j].descriptors[k]}`
				);

				console.log('DATA', ` ${currDomain?.id} | ${currSubDomain?.id} |  ${currDescriptor.id}`);
			}
		}
	}

	console.log('✅ Seed completed!');
}

seed()
	.catch((error) => {
		console.error('❌ Seed failed!');
		console.error(error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});

async function createDomainIfNotExists(name: string) {
	const [domain] = await db
		.insert(surveyDomains)
		.values({ name })
		.onConflictDoNothing({ target: surveyDomains.name })
		.returning({ id: surveyDomains.id });
	return domain;
}
async function createSubDomainIfNotExists({
	name,
	domainId,
	description
}: {
	name: string;
	domainId: number;
	description: string;
}) {
	const [subDomain] = await db
		.insert(surveySubDomains)
		.values({ name, domainId, description })
		.onConflictDoNothing({ target: surveySubDomains.name })
		.returning({ id: surveySubDomains.id });
	return subDomain;
}
async function createQuestionIfNotExists({
	text,
	subDomainId
}: {
	text: string;
	subDomainId: number;
}) {
	const [question] = await db
		.insert(surveyQuestions)
		.values({ text, subDomainId })
		.onConflictDoNothing({ target: surveyQuestions.text })
		.returning({ id: surveyQuestions.id });
	return question;
}
