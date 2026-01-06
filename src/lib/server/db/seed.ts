import { hash } from '@node-rs/argon2';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, {
	casing: 'snake_case'
});

import { RUBRIC_DATA, INITIAL_DISTRICTS, INITIAL_HTML_DATA } from '$lib/constants';
import {
	assessmentDomains,
	assessmentQuestions,
	assessmentSubDomains,
	districts,
	htmlEmailTemplates,
	users
} from './schema';
import { simpleRegisterToBeDEPRICATED } from '../queries';

async function seed() {
	// Clear existing data
	await db.delete(users);
	await db.delete(districts);
	await db.delete(htmlEmailTemplates);
	await db.delete(assessmentQuestions);
	await db.delete(assessmentSubDomains);
	await db.delete(assessmentDomains);

	console.log('🌱 Starting seed...');
	await createUCSuperUser();
	await createInitialDistrict();
	await createInitialHTMLTemplate();

	const data = RUBRIC_DATA;
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
					console.log(`🌱 Domain created: ${data[i].name}`);
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
					console.log(
						`🌱 SubDomain created id:${currSubDomain?.id} => ${data[i].subDomains[j].name}`
					);
				}
				currDescriptor = await createQuestionIfNotExists({
					text: data[i].subDomains[j].descriptors[k].text,
					subDomainId: currSubDomain?.id!
				});
				console.log(
					`🌱 Descriptor created id:${currDescriptor?.id} => ${data[i].subDomains[j].descriptors[k]}`
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
		.insert(assessmentDomains)
		.values({ name })
		.onConflictDoNothing({ target: assessmentDomains.name })
		.returning({ id: assessmentDomains.id });
	return domain;
}
async function createSubDomainIfNotExists({
	name,
	domainId,
	description
}: {
	name: string;
	domainId: string;
	description: string;
}) {
	const [subDomain] = await db
		.insert(assessmentSubDomains)
		.values({ name, domainId, description })
		.onConflictDoNothing({ target: assessmentSubDomains.name })
		.returning({ id: assessmentSubDomains.id });
	return subDomain;
}
async function createQuestionIfNotExists({
	text,
	subDomainId
}: {
	text: string;
	subDomainId: string;
}) {
	const [question] = await db
		.insert(assessmentQuestions)
		.values({ text, subDomainId })
		.onConflictDoNothing({ target: assessmentQuestions.text })
		.returning({ id: assessmentQuestions.id });
	return question;
}
async function createUCSuperUser() {
	const passwordHash = await hash('123456', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	await simpleRegisterToBeDEPRICATED({
		username: 'uc-super-user',
		passwordHash
	});
}
async function createInitialDistrict() {
	for (const districtName of INITIAL_DISTRICTS) {
		await db.insert(districts).values({
			name: districtName
		});
	}
}
async function createInitialHTMLTemplate() {
	await db.insert(htmlEmailTemplates).values({
		type: 'admin_invite',
		template: INITIAL_HTML_DATA
	});
}
