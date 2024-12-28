import { z } from 'zod';

export const createOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'name should be at least two characters ' })
		.max(50, { message: 'name should be less than 50 characters ' })
});

const UserRoleSchema = z.enum(['Master', 'District_Group', 'School_Admin', 'Teacher_Staff']);

type UserRole = z.infer<typeof UserRoleSchema>;
// type CreateOrganizationSchemaFormSchema = z.infer<typeof createOrganizationSchema>;
export type CreateOrganizationSchemaFormSchema = typeof createOrganizationSchema;
