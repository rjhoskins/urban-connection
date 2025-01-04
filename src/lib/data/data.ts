export const users = [
	// Master Account
	{
		id: 1,
		name: 'Master Admin',
		email: 'master.admin@example.com',
		createdAt: '2025-01-03T12:00:00Z',
		isActive: true,
		districtId: 1, // Assign to a default district
		schoolId: 4 // Assign to a default school
	},

	// District Accounts
	{
		id: 2,
		name: 'District Admin One',
		email: 'district1.admin@example.com',
		createdAt: '2025-01-03T12:01:00Z',
		isActive: true,
		districtId: 1,
		schoolId: 4 // Corresponding to districtId: 1
	},
	{
		id: 3,
		name: 'District Admin Two',
		email: 'district2.admin@example.com',
		createdAt: '2025-01-03T12:02:00Z',
		isActive: true,
		districtId: 2,
		schoolId: 6 // Corresponding to districtId: 2
	},

	// School Admin Accounts
	{
		id: 4,
		name: 'School Admin One',
		email: 'school1.admin@example.com',
		createdAt: '2025-01-03T12:03:00Z',
		isActive: true,
		districtId: 1,
		schoolId: 4
	},
	{
		id: 5,
		name: 'School Admin Two',
		email: 'school2.admin@example.com',
		createdAt: '2025-01-03T12:04:00Z',
		isActive: true,
		districtId: 1,
		schoolId: 7
	},
	{
		id: 6,
		name: 'School Admin Three',
		email: 'school3.admin@example.com',
		createdAt: '2025-01-03T12:05:00Z',
		isActive: true,
		districtId: 2,
		schoolId: 6
	},
	{
		id: 7,
		name: 'School Admin Four',
		email: 'school4.admin@example.com',
		createdAt: '2025-01-03T12:06:00Z',
		isActive: true,
		districtId: 2,
		schoolId: 14
	},
	{
		id: 8,
		name: 'School Admin Five',
		email: 'school5.admin@example.com',
		createdAt: '2025-01-03T12:07:00Z',
		isActive: true,
		districtId: 1,
		schoolId: 8
	},
	{
		id: 9,
		name: 'School Admin Six',
		email: 'school6.admin@example.com',
		createdAt: '2025-01-03T12:08:00Z',
		isActive: true,
		districtId: 2,
		schoolId: 12
	},
	{
		id: 10,
		name: 'School Admin Seven',
		email: 'school7.admin@example.com',
		createdAt: '2025-01-03T12:09:00Z',
		isActive: true,
		districtId: 1,
		schoolId: 22
	}
];

export const schools = [
	{
		id: 1,
		name: 'Happy Hedgehog Academy',
		createdBy: 'fun_creator_1',
		slug: 'happy-hedgehog-academy',
		status: 'active',
		districtId: 5,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 2,
		name: 'Witty Walrus Institute',
		createdBy: 'fun_creator_2',
		slug: 'witty-walrus-institute',
		status: 'active',
		districtId: 5,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 3,
		name: 'Cheeky Cheetah School',
		createdBy: 'fun_creator_3',
		slug: 'cheeky-cheetah-school',
		status: 'active',
		districtId: 4,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 4,
		name: 'Jolly Jellyfish Academy',
		createdBy: 'fun_creator_4',
		slug: 'jolly-jellyfish-academy',
		status: 'active',
		districtId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 5,
		name: 'Bubbly Bumblebee Academy',
		createdBy: 'fun_creator_5',
		slug: 'bubbly-bumblebee-academy',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 6,
		name: 'Snazzy Seahorse School',
		createdBy: 'fun_creator_6',
		slug: 'snazzy-seahorse-school',
		status: 'active',
		districtId: 2,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 7,
		name: 'Funky Flamingo Institute',
		createdBy: 'fun_creator_7',
		slug: 'funky-flamingo-institute',
		status: 'active',
		districtId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 8,
		name: 'Zesty Zebra School',
		createdBy: 'fun_creator_8',
		slug: 'zesty-zebra-school',
		status: 'active',
		districtId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 9,
		name: 'Perky Panda Academy',
		createdBy: 'fun_creator_9',
		slug: 'perky-panda-academy',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 10,
		name: 'Groovy Giraffe School',
		createdBy: 'fun_creator_10',
		slug: 'groovy-giraffe-school',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 11,
		name: 'Dandy Dolphin Academy',
		createdBy: 'fun_creator_11',
		slug: 'dandy-dolphin-academy',
		status: 'active',
		districtId: 4,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 12,
		name: 'Chirpy Cricket School',
		createdBy: 'fun_creator_12',
		slug: 'chirpy-cricket-school',
		status: 'active',
		districtId: 2,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 13,
		name: 'Peppy Penguin Institute',
		createdBy: 'fun_creator_13',
		slug: 'peppy-penguin-institute',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 14,
		name: 'Nifty Narwhal Academy',
		createdBy: 'fun_creator_14',
		slug: 'nifty-narwhal-academy',
		status: 'active',
		districtId: 2,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 15,
		name: 'Sassy Starfish School',
		createdBy: 'fun_creator_15',
		slug: 'sassy-starfish-school',
		status: 'active',
		districtId: 5,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 16,
		name: 'Wacky Whale Academy',
		createdBy: 'fun_creator_16',
		slug: 'wacky-whale-academy',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 17,
		name: 'Brisk Bunny Institute',
		createdBy: 'fun_creator_17',
		slug: 'brisk-bunny-institute',
		status: 'active',
		districtId: 5,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 18,
		name: 'Plucky Parrot Academy',
		createdBy: 'fun_creator_18',
		slug: 'plucky-parrot-academy',
		status: 'active',
		districtId: 2,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 19,
		name: 'Bold Bear School',
		createdBy: 'fun_creator_19',
		slug: 'bold-bear-school',
		status: 'active',
		districtId: 2,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 20,
		name: 'Charming Coyote Institute',
		createdBy: 'fun_creator_20',
		slug: 'charming-coyote-institute',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 21,
		name: 'Spirited Squirrel Academy',
		createdBy: 'fun_creator_21',
		slug: 'spirited-squirrel-academy',
		status: 'active',
		districtId: 4,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 22,
		name: 'Dynamic Deer School',
		createdBy: 'fun_creator_22',
		slug: 'dynamic-deer-school',
		status: 'active',
		districtId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 23,
		name: 'Jovial Jaguar Academy',
		createdBy: 'fun_creator_23',
		slug: 'jovial-jaguar-academy',
		status: 'active',
		districtId: 1,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 24,
		name: 'Merry Moose School',
		createdBy: 'fun_creator_24',
		slug: 'merry-moose-school',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	},
	{
		id: 25,
		name: 'Zany Zebra Academy',
		createdBy: 'fun_creator_25',
		slug: 'zany-zebra-academy',
		status: 'active',
		districtId: 3,
		createdAt: '2024-01-04',
		lastLogin: '2024-12-26'
	}
];

export const districts = [
	{
		id: 1,
		name: 'Sassy Squirrel Academy District',
		slug: 'sassy-squirrel-academy-district',
		status: 'active'
	},
	{
		id: 2,
		name: 'Gigglesnort Unified School District',
		slug: 'gigglesnort-unified-school-district',
		status: 'active'
	},
	{
		id: 3,
		name: 'Rainbow Sprinkle Charter Schools',
		slug: 'rainbow-sprinkle-charter-schools',
		status: 'active'
	},
	{
		id: 4,
		name: 'Pineapple Pop Elementary District',
		slug: 'pineapple-pop-elementary-district',
		status: 'active'
	},
	{
		id: 5,
		name: 'Quirkytown Learning Alliance',
		slug: 'quirkytown-learning-alliance',
		status: 'active'
	}
];
