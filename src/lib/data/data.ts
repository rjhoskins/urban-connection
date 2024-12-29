// data.ts

export const users = [
	{
		id: 1,
		name: 'Master Account',
		slug: 'master-account',
		type: 'Master',
		email: 'master@education.org',
		status: 'active',
		districtId: null,
		schoolId: null,
		createdAt: '2024-01-01',
		lastLogin: '2024-12-26'
	},
	{
		id: 2,
		name: 'Group Admin',
		slug: 'group-admin',
		type: 'District/Group',
		email: 'groupadmin@education.org',
		status: 'active',
		districtId: null,
		schoolId: null,
		createdAt: '2024-01-01',
		lastLogin: '2024-12-25'
	},
	{
		id: 3,
		name: 'District A Admin',
		slug: 'district-a-admin',
		type: 'District/Group',
		email: 'districta@education.org',
		status: 'active',
		districtId: 1,
		schoolId: null,
		createdAt: '2024-01-02',
		lastLogin: '2024-12-26'
	},
	{
		id: 4,
		name: 'School A1 Admin',
		slug: 'school-a1-admin',
		type: 'School Admin',
		email: 'schoola1@districta.org',
		status: 'active',
		districtId: 1,
		schoolId: 1,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-24'
	},
	{
		id: 5,
		name: 'School A2 Admin',
		slug: 'school-a2-admin',
		type: 'School Admin',
		email: 'schoola2@districta.org',
		status: 'active',
		districtId: 1,
		schoolId: 2,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-26'
	},
	{
		id: 6,
		name: 'Teacher A1-1',
		slug: 'teacher-a1-1',
		type: 'Teacher/Staff',
		email: 'teachera1-1@districta.org',
		status: 'active',
		districtId: 1,
		schoolId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 7,
		name: 'Teacher A1-2',
		slug: 'teacher-a1-2',
		type: 'Teacher/Staff',
		email: 'teachera1-2@districta.org',
		status: 'active',
		districtId: 1,
		schoolId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 8,
		name: 'District B Admin',
		slug: 'district-b-admin',
		type: 'District/Group',
		email: 'districtb@education.org',
		status: 'active',
		districtId: 2,
		schoolId: null,
		createdAt: '2024-01-02',
		lastLogin: '2024-12-26'
	},
	{
		id: 9,
		name: 'School B1 Admin',
		slug: 'school-b1-admin',
		type: 'School Admin',
		email: 'schoolb1@districtb.org',
		status: 'active',
		districtId: 2,
		schoolId: 3,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-26'
	},
	{
		id: 10,
		name: 'School B2 Admin',
		slug: 'school-b2-admin',
		type: 'School Admin',
		email: 'schoolb2@districtb.org',
		status: 'active',
		districtId: 2,
		schoolId: 4,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-25'
	},
	{
		id: 11,
		name: 'Teacher B1-1',
		slug: 'teacher-b1-1',
		type: 'Teacher/Staff',
		email: 'teacherb1-1@districtb.org',
		status: 'active',
		districtId: 2,
		schoolId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 12,
		name: 'District C Admin',
		slug: 'district-c-admin',
		type: 'District/Group',
		email: 'districtc@education.org',
		status: 'inactive',
		districtId: 3,
		schoolId: null,
		createdAt: '2024-01-02',
		lastLogin: '2024-12-20'
	},
	{
		id: 13,
		name: 'School C1 Admin',
		slug: 'school-c1-admin',
		type: 'School Admin',
		email: 'schoolc1@districtc.org',
		status: 'active',
		districtId: 3,
		schoolId: 5,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-26'
	},
	{
		id: 14,
		name: 'School C2 Admin',
		slug: 'school-c2-admin',
		type: 'School Admin',
		email: 'schoolc2@districtc.org',
		status: 'active',
		districtId: 3,
		schoolId: 6,
		createdAt: '2024-01-03',
		lastLogin: '2024-12-26'
	},
	{
		id: 15,
		name: 'Teacher C1-1',
		slug: 'teacher-c1-1',
		type: 'Teacher/Staff',
		email: 'teacherc1-1@districtc.org',
		status: 'active',
		districtId: 3,
		schoolId: 5,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	}
];

export const schools = [
	{ id: 1, name: 'School A1', slug: 'school-a1', districtId: 1, status: 'active' },
	{ id: 2, name: 'School A2', slug: 'school-a2', districtId: 1, status: 'active' },
	{ id: 3, name: 'School B1', slug: 'school-b1', districtId: 2, status: 'active' },
	{ id: 4, name: 'School B2', slug: 'school-b2', districtId: 2, status: 'active' },
	{ id: 5, name: 'School C1', slug: 'school-c1', districtId: 3, status: 'active' },
	{ id: 6, name: 'School C2', slug: 'school-c2', districtId: 3, status: 'active' }
];

export const districts = [
	{ id: 1, name: 'District A', slug: 'district-a', status: 'active' },
	{ id: 2, name: 'District B', slug: 'district-b', status: 'active' },
	{ id: 3, name: 'District C', slug: 'district-c', status: 'active' }
];
