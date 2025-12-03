import { z } from 'zod';

const questionSchema = z.object({
	id: z.number(),
	subdomainId: z.number(),
	value: z.union([z.literal(0), z.literal(1)]),
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

const assessmentDataSchema = z.array(domainSchema);

export type Question = z.infer<typeof questionSchema>;
export type Subdomain = z.infer<typeof subDomainSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type AssessmentData = z.infer<typeof assessmentDataSchema>;

export default assessmentDataSchema;

export const createAssessmentDemographicsAndAssessmentResponseFormSchema = z
	.object({
		assessmentToken: z.string(),
		yearsTeaching: z.string().regex(/^\d+$/, 'yearsTeaching must be a numeric string'),
		subjectTaught: z.string()
	})
	.catchall(z.string().regex(/^[01]?$/, "Responses must be '0', '1', or an empty string"));

const createAssessmentQuestionResponseSchema = z
	.object({
		questionId: z.coerce.number(),
		assessmentId: z.coerce.number(),
		response: z.union([z.literal(0), z.literal(1), z.null()]).default(null),
		isValidSubdomainGroup: z.boolean().default(false)
	})
	.array();

export type CreateQuestionResponseInput = z.infer<typeof createAssessmentQuestionResponseSchema>;
