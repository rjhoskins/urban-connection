import { number, z, ZodIssueCode } from 'zod';
import { districts } from './data/data';
// keep for register form until deprecated
export const createNewUserOrLoginSchema = z.object({
	username: z
		.string()
		// .email({ message: 'invalid email, should be your school email' })
		.nonempty({ message: 'user name is required' })
		.min(4, { message: 'user name should be at least four characters' })
		.max(50, { message: 'user name should be less than 50 characters' }),
	password: z
		.string()
		.nonempty({ message: 'password is required' })
		.min(6, { message: 'password should be at least four characters' })
		.max(50, { message: 'password should be less than 50 characters' }),
	remember: z.string().optional().default('false')
});

export const createNewUserFromInviteSchema = z
	.object({
		name: z.string(),
		email: z.string().email({ message: 'invalid email' }),
		inviteId: z.string(),
		password: z
			.string()
			.nonempty({ message: 'password is required' })
			.min(4, { message: 'password should be at least four characters' })
			.max(50, { message: 'password should be less than 50 characters' })
			.max(50, { message: 'name should be less than 50 characters' }),
		confirm: z
			.string()
			.nonempty({ message: 'password is required' })
			.min(4, { message: 'password should be at least four characters' })
			.max(50, { message: 'password should be less than 50 characters' })
	})

	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm'] // path of error);
	});

export const newUserTokenSchema = z.object({
	name: z.string(),
	inviteId: z.string(),
	email: z.string().email({ message: 'invalid token' })
});
export const inviteNewUserSchema = z.object({
	name: z.string(),
	inviteId: z.string(),
	email: z.string().email({ message: 'invalid email' }),
	phone: z.string().optional()
});
export const sendAssessmentInviteSchem = z.object({
	name: z
		.string()
		.min(2, { message: 'name should be at least two characters' })
		.max(256, { message: 'name should not be an essay' }),
	email: z.string().email({ message: 'invalid email' })
});
export const schoolAdminUserInviteHTMLEmailTemplateSchema = z.object({
	greeting: z.string().nonempty({ message: 'Greeting text is required' }),
	definition: z.string().nonempty({ message: 'Definition text is required' }),
	keyPoints: z
		.string()
		.array()
		.nonempty({ message: 'Key points are required' })
		.min(2, { message: 'At least two key points are required' })
		.max(8, { message: 'No more than eight key points are allowed' }),
	closing: z.string().nonempty({ message: 'Closing text is required' }),
	callToAction: z.string().nonempty({ message: 'call To Action text is required' }),
	registrationLinkText: z.string().nonempty({ message: 'Link text text is required' })
});

export const createSchoolSchema = z
	.object({
		isDistrict: z.boolean().default(false).optional(), // hack until zod can handle optional fields
		name: z.string().optional(), //implemented below in superRefine
		// .nonempty({ message: 'school name is required' })
		// .min(4, { message: 'school name should be at least four characters' })
		// .max(50, { message: 'school name should be less than 50 characters' }),
		districtId: z.number().min(1, { message: 'district is required' }).default(0), //TODO IN OTHER SCHEMASS WHEN DISTRICTS ARE IMPLEMENTED
		adminName: z
			.string()
			.nonempty({ message: 'admin name is required' })
			.min(3, { message: 'admin name should be at least three characters' })
			.max(50, { message: 'admin name should be less than 50 characters' }),
		adminEmail: z
			.string()
			.email({ message: 'invalid email' })
			.nonempty({ message: 'admin email is required, should be a school email' })
			.min(4, { message: 'admin email should be at least four characters' }),
		adminPhone: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (data.isDistrict && !data.name) {
			//happy path
			// console.log('happy happy joy joy????');
			return;
		} else if (data.isDistrict && data.name) {
			// console.log('both????');
			// ctx.addIssue({
			// 	code: ZodIssueCode.custom,
			// 	path: ['isDistrict'],
			// 	message: 'A District name already exists, if you want to create a school, select school.'
			// });
			return;
		} else {
			// console.log('school=> ');
			if (data.name == '' || data.name == undefined) {
				// .nonempty({ message: 'school name is required' })
				console.log('school name is required', data.name);
				ctx.addIssue({
					code: ZodIssueCode.invalid_type,
					expected: 'string',
					received: typeof data.name,
					path: ['name'],
					message: 'school name is required'
				});
				ctx.addIssue({
					code: ZodIssueCode.too_small,
					minimum: 4,
					path: ['name'],
					type: 'string',
					inclusive: true,
					message: 'school name should be at least four characters'
				});
			}
			if (data.name && data.name.length < 4) {
				// .min(4, { message: 'school name should be at least four characters' })
				console.log('school name should be at least four characters', data.name);
				ctx.addIssue({
					code: ZodIssueCode.too_small,
					minimum: 4,
					path: ['name'],
					type: 'string',
					inclusive: true,
					message: 'school name should be at least four characters'
				});
			}
			if (data.name && data.name.length > 50) {
				// .max(50, { message: 'school name should be less than 50 characters' })
				console.log('school name should be less than 50 characters', data.name);
				ctx.addIssue({
					code: ZodIssueCode.too_big,
					maximum: 50,
					path: ['name'],
					type: 'string',
					inclusive: true,
					message: 'school name should be less than 50 characters'
				});
			}
		}
	});

const UserRoleSchema = z.enum(['Master', 'District', 'School_Admin']);

type UserRole = z.infer<typeof UserRoleSchema>;
export type UserInviteHTMLEmailTemplateType = z.infer<
	typeof schoolAdminUserInviteHTMLEmailTemplateSchema
>;
// export type CreateSchoolSchemaFormSchema = typeof createSchoolSchema;
// export type CreateSchoolSchemaFormSchema = typeof createSchoolSchema;

export const themes = ['light', 'dark'] as const;
export const languages = ['en', 'es', 'fr'] as const;
export const errorPageList = [
	"I promise not to peek at assessments I'm not supposed to see",
	'I understand that some assessments are double top secret',
	"I'll be patient and wait for assessments I'm authorized to take"
] as const;
export const allergies = ['peanuts', 'dairy', 'gluten', 'soy', 'shellfish'] as const;
export const colors = {
	blu: 'Blue',
	red: 'Red',
	grn: 'Green',
	ylw: 'Yellow',
	blk: 'Black'
} as const;

export const schema = z.object({
	// email: z.string().email('Please enter a valid email.'),
	// bio: z.string().optional(),
	// fruit: z.string().optional(),
	// theme: z.enum(themes).default('light'),
	// language: z.enum(languages).default('en'),
	// district: z.enum(districts.map((d) => d.name) as [string, ...string[]]).default(''),
	// marketingEmails: z.boolean().default(true),
	errorPageList: z.array(z.enum(errorPageList))
	// colors: z
	// 	.array(z.enum(Object.keys(colors) as [Color, ...Color[]]))
	// 	.min(1, 'Please select at least one color.')
});

type Color = keyof typeof colors;

export const adminInviteSchema = z.object({
	id: z.string(),
	name: z.string().nonempty(),
	email: z.string().email(),
	isSent: z.boolean().default(false).optional(),
	invitee: z.string().nullable().optional(),
	inviter: z.string(),
	expiration: z.string().datetime().optional(),
	isUsed: z.boolean().default(false).optional(),
	role: z
		.enum(['super_admin', 'district_admin', 'school_admin'])
		.default('school_admin')
		.optional(),
	inviteType: z.enum(['school', 'district']).default('school'),
	schoolId: z.number().nullable().optional(),
	districtId: z.number().nullable()
});

export const createUserSchema = z.object({
	id: z.string(),
	username: z
		.string()
		// .email({ message: 'invalid email, should be your school email' })
		.nonempty({ message: 'user name is required' })
		.min(4, { message: 'user name should be at least four characters' })
		.max(50, { message: 'user name should be less than 50 characters' }),
	name: z
		.string()
		.nonempty({ message: 'name is required' })
		.min(2, { message: 'name should be at least two characters' }),
	role: z.enum(['district_admin', 'school_admin']).optional(),
	phone: z.string().optional()
});

export const AssessmentTokenInviteSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	surveyId: z.string().min(1, 'Survey ID is required'),
	schoolId: z.string().min(1, 'School ID is required')
});

export type AdminInvite = z.infer<typeof adminInviteSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
