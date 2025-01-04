import { z } from 'zod';
import { districts } from './data/data';

export const createNewUserSchema = z.object({
	username: z
		.string()
		.nonempty({ message: 'name is required' })
		.min(4, { message: 'name should be at least four characters ' })
		.max(50, { message: 'name should be less than 50 characters ' }),
	password: z
		.string()
		.nonempty({ message: 'password is required' })
		.min(4, { message: 'password should be at least four characters ' })
		.max(50, { message: 'password should be less than 50 characters ' })
});
export const createSchoolSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'school name is required' })
		.min(4, { message: 'school name should be at least four characters ' })
		.max(50, { message: 'school name should be less than 50 characters ' }),
	district: z
		.enum(districts.map((d) => d.name) as [string, ...string[]], {
			message: 'must select a district.'
		})
		.default(''),
	adminName: z
		.string()
		.nonempty({ message: 'admin name is required' })
		.min(4, { message: 'admin name should be at least four characters ' })
		.max(50, { message: 'admin name should be less than 50 characters ' }),
	adminEmail: z
		.string()
		.email({ message: 'invalid email' })
		.nonempty({ message: 'admin email is required' })
		.min(4, { message: 'admin email should be at least four characters ' })
		.max(50, { message: 'admin email should be less than 50 characters ' })
});
const UserRoleSchema = z.enum(['Master', 'District', 'School_Admin']);

type UserRole = z.infer<typeof UserRoleSchema>;
// type CreateSchoolSchemaFormSchema = z.infer<typeof createSchoolSchema>;
// export type CreateSchoolSchemaFormSchema = typeof createSchoolSchema;

export const themes = ['light', 'dark'] as const;
export const languages = ['en', 'es', 'fr'] as const;
export const allergies = ['peanuts', 'dairy', 'gluten', 'soy', 'shellfish'] as const;
export const colors = {
	blu: 'Blue',
	red: 'Red',
	grn: 'Green',
	ylw: 'Yellow',
	blk: 'Black'
} as const;

export const schema = z.object({
	email: z.string().email('Please enter a valid email.'),
	bio: z.string().optional(),
	fruit: z.string().optional(),
	theme: z.enum(themes).default('light'),
	language: z.enum(languages).default('en'),
	district: z.enum(districts.map((d) => d.name) as [string, ...string[]]).default(''),
	marketingEmails: z.boolean().default(true),
	allergies: z.array(z.enum(allergies)),
	colors: z
		.array(z.enum(Object.keys(colors) as [Color, ...Color[]]))
		.min(1, 'Please select at least one color.')
});

type Color = keyof typeof colors;
