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

export const createSurveyDemographicsResponseSchema = z.object({
	yearsTeaching: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => {
			if (val == null) return null;
			const num = Number(val);
			return isNaN(num) ? null : num;
		}),
	surveyId: z
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
export const surveyResponseSchema = z.object({
	isFirstQuestion: z.boolean().optional(),
	isLastQuestion: z.boolean().optional(),
	surveyId: z
		.union([z.string(), z.number(), z.null()])
		.optional()
		.transform((val) => {
			if (val == null) return null;
			const num = Number(val);
			return isNaN(num) ? null : num;
		}),
	questions: z.array(
		z.object({ questionId: z.number(), surveyId: z.number(), response: z.boolean() })
	)
});

export type CreateDemographicsResponseInput = z.infer<
	typeof createSurveyDemographicsResponseSchema
>;

const SurveyQuestionFormResponseSchema = z.object({
	surveyId: z.coerce.number(),
	totalQuestions: z.coerce.number().optional(),
	isFirstQuestion: z.enum(['true', 'false']).optional(),
	isLastQuestion: z.enum(['true', 'false']).optional()
});

const createSurveyQuestionResponseSchema = z
	.object({
		surveyId: z.coerce.number(),
		questionId: z.coerce.number(),
		response: z.boolean()
	})
	.array();

export type CreateQuestionResponseInput = z.infer<typeof createSurveyQuestionResponseSchema>;
