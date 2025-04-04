export const SERVER_ERROR_MESSAGES = {
	'400': 'Check your info and try again.',
	'401': 'Unauthorized',
	'403': 'Forbidden',
	'404': 'Not found',
	'500': 'Server error'
};

export const ASSESSMENT_PROGRESS_IMG_MAP = new Map([
	//key: domain name, value: image path
	['Cultural Awareness', '/img/cultural-awareness-progress.png'],
	['Systems', '/img/systems-progress.png'],
	['Relationships', '/img/relationships-progress.png'],
	['Rigorous & Accessible Content', '/img/community-progress.png']
]);
export const INITIAL_HTML_DATA = {
	greeting: 'Dear Administrator,',
	definition:
		'The Urban Connection Project defines Cultural Responsiveness as the bridge between people built by the infusion of cultural experiences necessary to:',
	keyPoints: [
		'implement systems of accountability',
		'cultivate necessary relationships',
		'ensure content acquisition (education)'
	],
	closing: 'We are happy to partner with you!',
	callToAction: 'Please register to access your organization',
	registrationLinkText: 'here'
};
export const demographicsData = {
	name: 'Demographics',
	type: 'demographics',
	subDomains: [
		{
			name: 'Demographics',
			description: 'Please provide the following information about yourself.',
			fields: [
				{
					label: 'Years Teaching',
					fieldName: 'yearsTeaching',
					type: 'number',
					value: null,
					placeholder: 'Enter number of years teaching'
				},
				{
					label: 'Subject',
					fieldName: 'subjectTaught',
					type: 'select',
					value: null,
					options: [
						{
							value: 'Math',
							label: 'Math'
						},
						{
							value: 'Science',
							label: 'Science'
						},
						{
							value: 'English',
							label: 'English'
						}
					]
				}
			]
		}
	]
};
const rubricData = [
	{
		name: 'Cultural Awareness',
		totalPoints: 24,
		subDomains: [
			{
				name: 'Cultural Awareness',
				type: 'sub',
				description:
					'The school demonstrates intentionality in an effort to become/remain culturally aware, and use that understanding to guide decisions, foster relationships, and create an inclusive environment for students, families, and the community.',
				descriptors: [
					{
						id: 'Cultural_Awareness_1',
						text: 'Training is provided regularly for the school to remain culturally aware of the community being served and the society (at large)',
						value: null
					},
					{
						id: 'Cultural_Awareness_2',
						text: 'There is a consistent effort for families from all cultural backgrounds (race, ethnicity, gender, religion, ability, disability, etc.) to feel welcomed and respected',
						value: null
					},
					{
						id: 'Cultural_Awareness_3',
						text: 'The school celebrates cultural diversity through events, displays, and traditions',
						value: null
					},
					{
						id: 'Cultural_Awareness_4',
						text: 'Students feel comfortable expressing their cultural identities without fear of judgment',
						value: null
					},
					{
						id: 'Cultural_Awareness_5',
						text: 'Families and community members are regularly assessmented (at least semi-annually) to understand their experiences and perceptions of cultural inclusivity at the school',
						value: null
					}
				]
			},
			{
				name: 'Mentorship',
				points: 5,
				description:
					'There is prioritization in student mentorship, focusing on building meaningful relationships with students, families, and the community. The efforts are in an attempt to foster trust, empowerment, and life skills, creating a supportive environment for long-term student success.',
				descriptors: [
					{
						id: 'Mentorship_1',
						text: 'Connecting with students in a mentoring role (in addition to teaching) is promoted regularly',
						value: null
					},
					{
						id: 'Mentorship_2',
						text: 'The mentorship includes teaching life skills like goal setting, conflict resolution, time management, and self-advocacy',
						value: null
					},
					{
						id: 'Mentorship_3',
						text: 'Students have access to resources like counseling or peer support groups',
						value: null
					},
					{
						id: 'Mentorship_4',
						text: "The school's culture emphasizes caring for the whole child, with staff being encouraged to go beyond academic instruction to guide and support students",
						value: null
					},
					{
						id: 'Mentorship_5',
						text: 'Staff receives training to build meaningful relationships and effectively guide students',
						value: null
					}
				]
			},
			{
				name: 'Representation',
				points: 5,
				description:
					"The school purposefully incorporates representations of the students' ethnicities, genders, relevant interests, personal experiences, etc.",
				descriptors: [
					{
						id: 'Representation_1',
						text: 'Up-to-date visual representations in every area of campus (classrooms, cafeteria, hallways, main office, library, etc.)',
						value: null
					},
					{
						id: 'Representation_2',
						text: 'Library books (fiction and nonfiction) represent the school demographic (interests, race, gender, ethnicity, etc.)',
						value: null
					},
					{
						id: 'Representation_3',
						text: 'In the Library, every student can find a figure they relate to in a prominent, high achieving and/or affluent role within the books',
						value: null
					},
					{
						id: 'Representation_4',
						text: 'Curriculum choices are inclusive of school demographic',
						value: null
					},
					{
						id: 'Representation_5',
						text: 'School-wide celebrations are inclusive of all school demographics (holidays, cultural fairs, etc.)',
						value: null
					}
				]
			},
			{
				name: 'Community Involvement',
				points: 4,
				description:
					'The school intentionally coordinates opportunities to be involved with the community being served. These events allow the school to be seen as a part of the community, instead of apart from the community. The goal of the events is to enhance the relationship (and perception) of the school with the area it serves.',
				descriptors: [
					{
						id: 'Community_Involvement_1',
						text: '4 or more (non-sports related) events planned specifically for community participation per year',
						value: null
					},
					{
						id: 'Community_Involvement_2',
						text: "2 or more of the events allow the community to be on the school's campus",
						value: null
					},
					{
						id: 'Community_Involvement_3',
						text: '2 or more philanthropic event(s) coordinated to give back to the community through service',
						value: null
					},
					{
						id: 'Community_Involvement_4',
						text: 'Staff is encouraged/incentivized to attend organized events',
						value: null
					}
				]
			},
			{
				name: 'Overall School Morale',
				points: 5,
				description:
					'Educators feel supported and valued by their administration. Areas like communication, workload, professional growth, and emotional support are prioritized to better understand needs and take actionable steps to create an environment where educators thrive and deliver their best to the students.',
				descriptors: [
					{
						id: 'Overall_School_Morale_1',
						text: 'Teachers have clear expectations for their roles, evaluations, and responsibilities',
						value: null
					},
					{
						id: 'Overall_School_Morale_2',
						text: 'There is an effort to keep the workload manageable and realistic, including planning time, grading, and meetings',
						value: null
					},
					{
						id: 'Overall_School_Morale_3',
						text: 'Teachers have uninterrupted time during school hours (at least) weekly to plan, prepare and collaborate',
						value: null
					},
					{
						id: 'Overall_School_Morale_4',
						text: "Teachers' mental health and well-being are prioritized with regular check ins and attempts to reduce stress through resources, conversation or programs",
						value: null
					},
					{
						id: 'Overall_School_Morale_5',
						text: 'Administrators are present, approachable, and actively involved in day-to-day school activities',
						value: null
					}
				]
			}
		]
	},
	{
		name: 'Systems',
		totalPoints: 26,
		subDomains: [
			{
				name: 'Systemic Expectations',
				points: 6,
				description:
					"The school's system establishes inclusive language and clear expectations involving all stakeholders. System-wide expectations for behavior, academics, and citizenship are clearly defined, consistently enforced, and visibly reinforced in classrooms and common areas, promoting a culture of accountability and high standards.",
				descriptors: [
					{
						id: 'Systemic_Expectations_1',
						text: 'Consistent use of established common language (i.e. respectful, responsible, safe)',
						value: null
					},
					{
						id: 'Systemic_Expectations_2',
						text: 'Visual reminders of common language present in all classrooms and common areas',
						value: null
					},
					{
						id: 'Systemic_Expectations_3',
						text: 'Visual representation of expectations posted in all classrooms and common areas',
						value: null
					},
					{
						id: 'Systemic_Expectations_4',
						text: 'Expectations are expressed Daily',
						value: null
					},
					{
						id: 'Systemic_Expectations_5',
						text: 'Verbal reminder of expectations are given prior to all tasks/activities',
						value: null
					},
					{
						id: 'Systemic_Expectations_6',
						text: 'Common language and expectations can be recited by at least 90% of all stakeholders (Admin, Teachers, Staff, Students, Parents)',
						value: null
					}
				]
			},
			{
				name: 'Behavior Interventions',
				points: 7,
				description:
					"An established sequence of interventions is clear to all parties (administration, educators, staff and students) when an expectation is not being met. The consequence sequence or flow is visible. Students are aware of the 'next step' if they choose to fall below the expectations, both in class and in school.",
				descriptors: [
					{
						id: 'Behavior_Interventions_1',
						text: 'An Intervention flow chart has been established for tier 1 behaviors, before administrative escalation',
						value: null
					},
					{
						id: 'Behavior_Interventions_2',
						text: 'The established flow chart has a clear progression of 3-5 interventions',
						value: null
					},
					{
						id: 'Behavior_Interventions_3',
						text: 'The school-wide flow chart includes restorative practices',
						value: null
					},
					{
						id: 'Behavior_Interventions_4',
						text: 'Visible representation of the behavioral flow chart is present in all applicable areas',
						value: null
					},
					{
						id: 'Behavior_Interventions_5',
						text: 'When an infraction occurs, verbal confirmation is given to the student about where they are on the flow chart and what choices they have moving forward',
						value: null
					},
					{
						id: 'Behavior_Interventions_6',
						text: 'Knowledge of flow chart is known by all parties: Administration, Teachers, Staff, Students and Parents',
						value: null
					},
					{
						id: 'Behavior_Interventions_7',
						text: 'There is a clear distinction of interventions between tier 1, 2 and 3 behaviors',
						value: null
					}
				]
			},
			{
				name: 'Restorative Practices',
				points: 6,
				description:
					'Restorative practices are prioritized at the classroom level to address conflicts and misbehavior before escalating to administration. By evaluating strategies like restorative conversations, relationship-building, and collaborative problem-solving, schools can identify their efforts to repair harm, promote accountability, and strengthen connections with students, families, and the community.',
				descriptors: [
					{
						id: 'Restorative_Practices_1',
						text: 'Staff receive ongoing professional development in restorative practices, conflict resolution, and effective communication strategies',
						value: null
					},
					{
						id: 'Restorative_Practices_2',
						text: 'Restorative strategies are asked to be applied consistently across classrooms',
						value: null
					},
					{
						id: 'Restorative_Practices_3',
						text: 'Every classroom has a separate restorative area for students to utilize when necessary',
						value: null
					},
					{
						id: 'Restorative_Practices_4',
						text: 'Protocol tracking tools, resources, and data are readily available and accounted for to assess the effectiveness of the practice',
						value: null
					},
					{
						id: 'Restorative_Practices_5',
						text: 'If administrative support occurs, there is a restorative process in place for re-entry to the classroom that includes making everyone aware of how to support moving forward',
						value: null
					},
					{
						id: 'Restorative_Practices_6',
						text: 'Parent/Guardian is made aware of the restorative practice specific to the incident',
						value: null
					}
				]
			},
			{
				name: 'Positive Reinforcements',
				points: 7,
				description:
					'Effective use of positive reinforcements at both the classroom and administrative levels encourage student engagement and success. This reinforcement can include incentive programs, student praise and recognition strategies, all contributing to a supportive and encouraging school culture.',
				descriptors: [
					{
						id: 'Positive_Reinforcements_1',
						text: 'The school has structured programs to highlight and honor desired behaviors from students (both) in the classroom and school-wide',
						value: null
					},
					{
						id: 'Positive_Reinforcements_2',
						text: 'Visual representation of program is present in all applicable areas',
						value: null
					},
					{
						id: 'Positive_Reinforcements_3',
						text: 'There is a system present for students to know where they are within the program',
						value: null
					},
					{
						id: 'Positive_Reinforcements_4',
						text: 'Knowledge of how to acquire the incentive is known by all parties (Administration, Teachers, Staff, Students and Parents can recite)',
						value: null
					},
					{
						id: 'Positive_Reinforcements_5',
						text: 'The program(s) successfully recognizes at least 50% of the school population',
						value: null
					},
					{
						id: 'Positive_Reinforcements_6',
						text: 'There is a criteria established for students who do not qualify for major incentives to still earn some form of recognition',
						value: null
					},
					{
						id: 'Positive_Reinforcements_7',
						text: 'There is a daily, weekly, monthly/quarterly and yearly incentive established',
						value: null
					}
				]
			}
		]
	},
	{
		name: 'Relationships',
		totalPoints: 30,
		subDomains: [
			{
				name: 'Peaceful Resolution',
				points: 7,
				description:
					'There is an established practice to peacefully resolve conflict on a regular basis that allows students to learn and thrive as a result of the incident.',
				descriptors: [
					{
						id: 'Peaceful_Resolution_1',
						text: 'Training has been provided to resolve conflict using appropriate proximity, eye-level, volume, and connotation',
						value: null
					},
					{
						id: 'Peaceful_Resolution_2',
						text: 'There is an established conversation structure that allows all involved parties to speak respectfully',
						value: null
					},
					{
						id: 'Peaceful_Resolution_3',
						text: "Involved authority's priority is to listen and gain understanding",
						value: null
					},
					{
						id: 'Peaceful_Resolution_4',
						text: 'Teachers are trained to remain calm, use neutral language, and avoid power struggles when conflicts arise',
						value: null
					},
					{
						id: 'Peaceful_Resolution_5',
						text: 'Students are taught and encouraged to use peer mediation, active listening, and problem-solving techniques',
						value: null
					},
					{
						id: 'Peaceful_Resolution_6',
						text: 'Teachers and students feel respected and supported when conflict arises',
						value: null
					},
					{
						id: 'Peaceful_Resolution_7',
						text: 'Best peaceful resolution practices are discussed, developed and practiced by staff',
						value: null
					}
				]
			},
			{
				name: 'Student Concern Process',
				points: 6,
				description:
					'There is a process in place for students and/or parents to safely submit concerns from feeling unsafe, without fear of judgement or backlash from others.',
				descriptors: [
					{
						id: 'Student_Concern_Process_1',
						text: 'Process or system is visible in all common areas and/or regular communication tool',
						value: null
					},
					{
						id: 'Student_Concern_Process_2',
						text: 'The process to submit concerns is seamless and easily accessible',
						value: null
					},
					{
						id: 'Student_Concern_Process_3',
						text: 'The submitted concern can only be seen by appointed support personnel',
						value: null
					},
					{
						id: 'Student_Concern_Process_4',
						text: 'Appointed support personnel is versed in counseling techniques to navigate concern',
						value: null
					},
					{
						id: 'Student_Concern_Process_5',
						text: 'There is an established response time for submitted concerns to be addressed',
						value: null
					},
					{
						id: 'Student_Concern_Process_6',
						text: 'Knowledge of the process is known by all parties (students, staff, parents, community)',
						value: null
					}
				]
			},
			{
				name: 'Knowledge of Students',
				points: 3,
				description:
					"There is evidence that the administration, staff and educators know students' interests, family life, abilities, crisis', etc., and use that information to strengthen relationships.",
				descriptors: [
					{
						id: 'Knowledge_of_Students_1',
						text: 'Student assessment data is utilized to learn more about students interests, strengths, and challenges, both academically and non-academically, and files are regularly updated',
						value: null
					},
					{
						id: 'Knowledge_of_Students_2',
						text: 'Scheduled and non-scheduled conversations between educators and students are encouraged and common, in whole-group and/or individual/small group settings',
						value: null
					},
					{
						id: 'Knowledge_of_Students_3',
						text: "Curriculum, content questions, etc. are modified based on knowledge of students' interests",
						value: null
					}
				]
			},
			{
				name: 'Endearment',
				points: 5,
				description:
					'School personnel utilizes encouraging language that shows students that he/she cares as a mentor figure. Verbal and non-verbal language displayed provides affirmations, encouragement, positive reinforcement, close ties, etc. with authenticity.',
				descriptors: [
					{
						id: 'Endearment_1',
						text: 'Verbal terms of endearment are used regularly and consistently for all students by teachers, administrators and support staff',
						value: null
					},
					{
						id: 'Endearment_2',
						text: 'Non-verbal forms of endearment are used regularly (head-nod, smile, high-five, etc.)',
						value: null
					},
					{
						id: 'Endearment_3',
						text: 'Examples and/or training is provided to staff',
						value: null
					},
					{
						id: 'Endearment_4',
						text: 'Staff is expected to verbalize appropriate salutations with students upon entering and exiting class',
						value: null
					},
					{
						id: 'Endearment_5',
						text: 'Visual affirmations, encouragement, etc. are present in classrooms and high traffic areas',
						value: null
					}
				]
			},
			{
				name: 'Student-to-Student',
				points: 4,
				description:
					"There's a standard for student conversations to use appropriate language that encourages a positive and healthy culture. This standard of language uplifts, constructively criticizes when necessary and is inclusive.",
				descriptors: [
					{
						id: 'Student-to-Student_1',
						text: 'Explicit instruction for appropriate student-to-student conversation',
						value: null
					},
					{
						id: 'Student-to-Student_2',
						text: 'Visible talk structures are established for students to interact',
						value: null
					},
					{
						id: 'Student-to-Student_3',
						text: 'Scheduled supervised time for students to interact',
						value: null
					},
					{
						id: 'Student-to-Student_4',
						text: 'Positive reinforcement is utilized to encourage the continuation of desired respect and advocacy amongst students',
						value: null
					}
				]
			},
			{
				name: 'Caregiver Connection',
				points: 5,
				description:
					'A strong caregiver connection is made a priority at the school-wide and classroom level in order to promote attendance, citizenship and academic performance. Many systems are put in place to ensure the opportunity for relationship building from school personnel to caregiver.',
				descriptors: [
					{
						id: 'Caregiver_Connection_1',
						text: 'Initial contact and communication medium preferences are established with every caregiver (homeroom) within the first month of school by individual teachers',
						value: null
					},
					{
						id: 'Caregiver_Connection_2',
						text: "Caregiver contracts are created and maintained with clear expectations for all stakeholders (i.e. desired caregiver involvement in the students' attendance, behavior, academics, etc.)",
						value: null
					},
					{
						id: 'Caregiver_Connection_3',
						text: '1 positive call is required to the Caregiver(s) for each consequential call, and is monitored on a regular basis for all teachers & administrators',
						value: null
					},
					{
						id: 'Caregiver_Connection_4',
						text: 'Opportunities for caregivers to be present on campus (classes, events, parent volunteers, etc.) are available on a monthly basis, and encouraged regularly through some form of contact (teacher or school-wide)',
						value: null
					},
					{
						id: 'Caregiver_Connection_5',
						text: 'Caregivers and teachers conference about student performance on a quarterly/trimester basis',
						value: null
					}
				]
			}
		]
	},
	{
		name: 'Rigorous & Accessible Content',
		totalPoints: 21,
		subDomains: [
			{
				name: 'Lesson Planning',
				points: 4,
				description:
					"Lesson plans intentionally incorporate students' current skillset, as well as the desired level of mastery. There is additional planning for student misconceptions and the gaps of knowledge, as well as scaffolds to address them.",
				descriptors: [
					{
						id: 'Lesson_Planning_1',
						text: 'Sub-objectives are explicitly planned within the lesson plan as to provide checkpoints towards mastery',
						value: null
					},
					{
						id: 'Lesson_Planning_2',
						text: 'Scaffolding plans are included using proper task analysis and timing to reach desired outcome',
						value: null
					},
					{
						id: 'Lesson_Planning_3',
						text: 'Lessons and/or units intentionally progress the skill through multiple Depth of Knowledge (DOK) levels',
						value: null
					},
					{
						id: 'Lesson_Planning_4',
						text: 'Vocabulary recognition and application is explicit',
						value: null
					}
				]
			},
			{
				name: 'Real-Time Assessments',
				points: 7,
				description:
					"There are regular checks for understanding throughout the lesson to make sure the instructor is aware of students' current level of mastery. Students are given feedback and the opportunity to refine their thinking based on real-time assessments in order to be successful moving forward.",
				descriptors: [
					{
						id: 'Real-Time_Assessments_1',
						text: 'Real-Time Assessments align with logical skill chunking (e.g., for determining unknown word meanings: first identifying context clues, then using background knowledge, and finally determining the meaning)',
						value: null
					},
					{
						id: 'Real-Time_Assessments_2',
						text: 'RTAs have clear, visible expectations (written and verbally expressed)',
						value: null
					},
					{
						id: 'Real-Time_Assessments_3',
						text: 'RTAs include modeling & provide an exemplar that is explicitly reviewed with students',
						value: null
					},
					{
						id: 'Real-Time_Assessments_4',
						text: 'Timer is consistently utilized for task completion',
						value: null
					},
					{
						id: 'Real-Time_Assessments_5',
						text: 'Students are randomly selected to answer questions, explain thinking, and create academic discourse',
						value: null
					},
					{
						id: 'Real-Time_Assessments_6',
						text: 'Visible and easily accessible tracking for student mastery of the skill/standard being taught is consistently utilized',
						value: null
					},
					{
						id: 'Real-Time_Assessments_7',
						text: '2 or more real time assessments administered in each lesson per day',
						value: null
					}
				]
			},
			{
				name: 'Engagement',
				points: 5,
				description:
					'Lessons regularly engage students utilizing multiple tools and practices in order to maximize success for students.',
				descriptors: [
					{
						id: 'Engagement_1',
						text: 'Physical and verbal cues utilized throughout lesson',
						value: null
					},
					{
						id: 'Engagement_2',
						text: 'Instructors are expected to incorporate student interests and/or pop culture daily',
						value: null
					},
					{
						id: 'Engagement_3',
						text: 'Instructors utilize technology regularly to enhance lessons and increase engagement',
						value: null
					},
					{
						id: 'Engagement_4',
						text: "Lessons relate to and incorporate students' realities",
						value: null
					},
					{
						id: 'Engagement_5',
						text: 'Lessons purposefully and explicitly use all components of Gradual Release of Responsibility at intentional points of the lesson',
						value: null
					}
				]
			},
			{
				name: 'Assessments',
				points: 5,
				description:
					'Assess students regularly in order to determine mastery and areas of refinement as well as expose students to rigorous questions (content) & question types (format) present on summative and state tests.',
				descriptors: [
					{
						id: 'Assessments_1',
						text: 'Assessment questions are planned and incorporated into every lesson',
						value: null
					},
					{
						id: 'Assessments_2',
						text: 'Questions are structured to resemble state assessments, in order require the same skills',
						value: null
					},
					{
						id: 'Assessments_3',
						text: 'Technology assessments are utilized regularly',
						value: null
					},
					{
						id: 'Assessments_4',
						text: 'Performance is explicitly reviewed in order to determine areas of mastery and refinement',
						value: null
					},
					{
						id: 'Assessments_5',
						text: 'Students are made aware of their current level of mastery on a consistent basis',
						value: null
					}
				]
			}
		]
	}
];

export const RUBRIC_DATA = rubricData;

const testRubricData = [
	{
		name: 'Cultural Awareness',
		totalPoints: 24,
		subDomains: [
			{
				name: 'Cultural Awareness',
				points: 5,
				description:
					'The school demonstrates intentionality in an effort to become/remain culturally aware, and use that understanding to guide decisions, foster relationships, and create an inclusive environment.',
				descriptors: [
					'Training is provided regularly for cultural awareness.',
					'Families from all backgrounds feel welcomed and respected.',
					'The school celebrates cultural diversity through events.'
				]
			},
			{
				name: 'Mentorship',
				points: 5,
				description:
					'There is prioritization in student mentorship, focusing on building meaningful relationships with students, families, and the community.',
				descriptors: [
					'Connecting with students in a mentoring role is promoted.',
					'Students have access to resources like counseling.',
					'Staff receives training to build meaningful relationships.'
				]
			}
		]
	},
	{
		name: 'Systems',
		totalPoints: 26,
		subDomains: [
			{
				name: 'Systemic Expectations',
				points: 6,
				description:
					"The school's system establishes inclusive language and clear expectations involving all stakeholders.",
				descriptors: [
					'Consistent use of established common language.',
					'Visual reminders of expectations in common areas.',
					'Expectations are expressed daily.'
				]
			}
		]
	}
];

export const TEST_RUBRIC_DATA = testRubricData;

const testRubricData2 = [
	{
		name: 'Cultural Awareness',
		totalPoints: 24,
		type: 'domain',
		subDomains: [
			{
				name: 'Cultural Awareness',
				type: 'subdomain',
				description:
					'The school demonstrates intentionality in an effort to become/remain culturally aware, and use that understanding to guide decisions, foster relationships, and create an inclusive environment.',
				descriptors: [
					{
						id: 'cultural-awareness-1',
						value: null, // This will be set dynamically (true/false)
						text: 'Training is provided regularly for cultural awareness.'
					},
					{
						id: 'cultural-awareness-2',
						value: null,
						text: 'Families from all backgrounds feel welcomed and respected.'
					},
					{
						id: 'cultural-awareness-3',
						value: null,
						text: 'The school celebrates cultural diversity through events.'
					}
				]
			},
			{
				name: 'Mentorship',
				type: 'subdomain',
				description:
					'There is prioritization in student mentorship, focusing on building meaningful relationships with students, families, and the community.',
				descriptors: [
					{
						id: 'mentorship-1',
						value: null,
						text: 'Connecting with students in a mentoring role is promoted.'
					},
					{
						id: 'mentorship-2',
						value: null,
						text: 'Students have access to resources like counseling.'
					},
					{
						id: 'mentorship-3',
						value: null,
						text: 'Staff receives training to build meaningful relationships.'
					}
				]
			}
		]
	},
	{
		name: 'Systems',
		totalPoints: 26,
		subDomains: [
			{
				name: 'Systemic Expectations',
				type: 'sub',
				description:
					"The school's system establishes inclusive language and clear expectations involving all stakeholders.",
				descriptors: [
					{
						id: 'systemic-expectations-1',
						value: null,
						text: 'Consistent use of established common language.'
					},
					{
						id: 'systemic-expectations-2',
						value: null,
						text: 'Visual reminders of expectations in common areas.'
					},
					{
						id: 'systemic-expectations-3',
						value: null,
						text: 'Expectations are expressed daily.'
					}
				]
			}
		]
	}
];

export const TEST_RUBRIC_DATA2 = testRubricData2;
export const TEST_COMBINED_WITH_DEMOGRAPHICS = [demographicsData, ...testRubricData2];

export const ZERO_BASED_ALPHABET_NUMBERING = {
	0: 'A',
	1: 'B',
	2: 'C',
	3: 'D',
	4: 'E',
	5: 'F',
	6: 'G',
	7: 'H',
	8: 'I',
	9: 'J',
	10: 'K',
	11: 'L',
	12: 'M',
	13: 'N',
	14: 'O',
	15: 'P',
	16: 'Q',
	17: 'R',
	18: 'S',
	19: 'T',
	20: 'U',
	21: 'V',
	22: 'W',
	23: 'X',
	24: 'Y',
	25: 'Z'
};
