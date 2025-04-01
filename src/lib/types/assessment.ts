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

export const parseAndTransformCreateDemographicsData = z.object({
	yearsTeaching: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => {
			if (val == null) return null;
			const num = Number(val);
			return isNaN(num) ? null : num;
		}),
	assessmentId: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => {
			if (val == null) return null;
			const num = Number(val);
			return isNaN(num) ? null : num;
		}),
	subjectTaught: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => (val == null ? null : String(val))),
	schoolId: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => {
			if (val == null) return null;
			const num = Number(val);
			return isNaN(num) ? null : num;
		})
});

export type CreateDemographicsResponseInput = z.infer<
	typeof parseAndTransformCreateDemographicsData
>;

const createAssessmentQuestionResponseSchema = z
	.object({
		assessmentId: z.coerce.number(),
		questionId: z.coerce.number(),
		isValidSubdomainGroup: z.boolean().default(false),
		response: z.union([z.literal(0), z.literal(1), z.null()]).default(null)
	})
	.array();

export type CreateQuestionResponseInput = z.infer<typeof createAssessmentQuestionResponseSchema>;
