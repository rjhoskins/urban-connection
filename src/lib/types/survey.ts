import { z } from 'zod';

const questionSchema = z.object({
	id: z.number(),
	subdomainId: z.number(),
	value: z.union([z.null(), z.boolean()]),
	text: z.string()
});

const subDomainSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: z.literal('sub-domain'),
	description: z.string(),
	questions: z.array(questionSchema)
});

const domainSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: z.literal('domain'),
	subDomains: z.array(subDomainSchema)
});

const surveyDataSchema = z.array(domainSchema);

export type Question = z.infer<typeof questionSchema>;
export type Subdomain = z.infer<typeof subDomainSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type SurveyData = z.infer<typeof surveyDataSchema>;

export default surveyDataSchema;
