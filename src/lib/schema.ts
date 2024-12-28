import { z } from 'zod';

export const createOrganizationSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'name is required' })
		.min(4, { message: 'name should be at least four characters ' })
		.max(50, { message: 'name should be less than 50 characters ' })
});

const UserRoleSchema = z.enum(['Master', 'District_Group', 'School_Admin', 'Teacher_Staff']);

type UserRole = z.infer<typeof UserRoleSchema>;
// type CreateOrganizationSchemaFormSchema = z.infer<typeof createOrganizationSchema>;
export type CreateOrganizationSchemaFormSchema = typeof createOrganizationSchema;
