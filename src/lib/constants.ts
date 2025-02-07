export const SERVER_ERROR_MESSAGES = {
	'400': 'Check your info and try again.',
	'401': 'Unauthorized',
	'403': 'Forbidden',
	'404': 'Not found',
	'500': 'Server error'
};

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

const rubricData = [
	{
		name: 'Cultural Awareness',
		totalPoints: 24,
		subDomains: [
			{
				name: 'Cultural Awareness',
				points: 5,
				description:
					'The school demonstrates intentionality in an effort to become/remain culturally aware, and use that understanding to guide decisions, foster relationships, and create an inclusive environment for students, families, and the community.',
				descriptors: [
					'Training is provided regularly for the school to remain culturally aware of the community being served and the society (at large)',
					'There is a consistent effort for families from all cultural backgrounds (race, ethnicity, gender, religion, ability, disability, etc.) to feel welcomed and respected',
					'The school celebrates cultural diversity through events, displays, and traditions',
					'Students feel comfortable expressing their cultural identities without fear of judgment',
					'Families and community members are regularly surveyed (at least semi-annually) to understand their experiences and perceptions of cultural inclusivity at the school'
				]
			},
			{
				name: 'Mentorship',
				points: 5,
				description:
					'There is prioritization in student mentorship, focusing on building meaningful relationships with students, families, and the community. The efforts are in an attempt to foster trust, empowerment, and life skills, creating a supportive environment for long-term student success.',
				descriptors: [
					'Connecting with students in a mentoring role (in addition to teaching) is promoted regularly',
					'The mentorship includes teaching life skills like goal setting, conflict resolution, time management, and self-advocacy',
					'Students have access to resources like counseling or peer support groups',
					"The school's culture emphasizes caring for the whole child, with staff being encouraged to go beyond academic instruction to guide and support students",
					'Staff receives training to build meaningful relationships and effectively guide students'
				]
			},
			{
				name: 'Representation',
				points: 5,
				description:
					"The school purposefully incorporates representations of the students' ethnicities, genders, relevant interests, personal experiences, etc.",
				descriptors: [
					'Up-to-date visual representations in every area of campus (classrooms, cafeteria, hallways, main office, library, etc.)',
					'Library books (fiction and nonfiction) represent the school demographic (interests, race, gender, ethnicity, etc.)',
					'In the Library, every student can find a figure they relate to in a prominent, high achieving and/or affluent role within the books',
					'Curriculum choices are inclusive of school demographic',
					'School-wide celebrations are inclusive of all school demographics (holidays, cultural fairs, etc.)'
				]
			},
			{
				name: 'Community Involvement',
				points: 4,
				description:
					'The school intentionally coordinates opportunities to be involved with the community being served. These events allow the school to be seen as a part of the community, instead of apart from the community. The goal of the events is to enhance the relationship (and perception) of the school with the area it serves.',
				descriptors: [
					'4 or more (non-sports related) events planned specifically for community participation per year',
					"2 or more of the events allow the community to be on the school's campus",
					'2 or more philanthropic event(s) coordinated to give back to the community through service',
					'Staff is encouraged/incentivized to attend organized events'
				]
			},
			{
				name: 'Overall School Morale',
				points: 5,
				description:
					'Educators feel supported and valued by their administration. Areas like communication, workload, professional growth, and emotional support are prioritized to better understand needs and take actionable steps to create an environment where educators thrive and deliver their best to the students.',
				descriptors: [
					'Teachers have clear expectations for their roles, evaluations, and responsibilities',
					'There is an effort to keep the workload manageable and realistic, including planning time, grading, and meetings',
					'Teachers have uninterrupted time during school hours (at least) weekly to plan, prepare and collaborate',
					"Teachers' mental health and well-being are prioritized with regular check ins and attempts to reduce stress through resources, conversation or programs",
					'Administrators are present, approachable, and actively involved in day-to-day school activities'
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
					'Consistent use of established common language (i.e. respectful, responsible, safe)',
					'Visual reminders of common language present in all classrooms and common areas',
					'Visual representation of expectations posted in all classrooms and common areas',
					'Expectations are expressed Daily',
					'Verbal reminder of expectations are given prior to all tasks/activities',
					'Common language and expectations can be recited by at least 90% of all stakeholders (Admin, Teachers, Staff, Students, Parents)'
				]
			},
			{
				name: 'Behavior Interventions',
				points: 7,
				description:
					"An established sequence of interventions is clear to all parties (administration, educators, staff and students) when an expectation is not being met. The consequence sequence or flow is visible. Students are aware of the 'next step' if they choose to fall below the expectations, both in class and in school.",
				descriptors: [
					'An Intervention flow chart has been established for tier 1 behaviors, before administrative escalation',
					'The established flow chart has a clear progression of 3-5 interventions',
					'The school-wide flow chart includes restorative practices',
					'Visible representation of the behavioral flow chart is present in all applicable areas',
					'When an infraction occurs, verbal confirmation is given to the student about where they are on the flow chart and what choices they have moving forward',
					'Knowledge of flow chart is known by all parties: Administration, Teachers, Staff, Students and Parents',
					'There is a clear distinction of interventions between tier 1, 2 and 3 behaviors'
				]
			},
			{
				name: 'Restorative Practices',
				points: 6,
				description:
					'Restorative practices are prioritized at the classroom level to address conflicts and misbehavior before escalating to administration. By evaluating strategies like restorative conversations, relationship-building, and collaborative problem-solving, schools can identify their efforts to repair harm, promote accountability, and strengthen connections with students, families, and the community.',
				descriptors: [
					'Staff receive ongoing professional development in restorative practices, conflict resolution, and effective communication strategies',
					'Restorative strategies are asked to be applied consistently across classrooms',
					'Every classroom has a separate restorative area for students to utilize when necessary',
					'Protocol tracking tools, resources, and data are readily available and accounted for to assess the effectiveness of the practice',
					'If administrative support occurs, there is a restorative process in place for re-entry to the classroom that includes making everyone aware of how to support moving forward',
					'Parent/Guardian is made aware of the restorative practice specific to the incident'
				]
			},
			{
				name: 'Positive Reinforcements',
				points: 7,
				description:
					'Effective use of positive reinforcements at both the classroom and administrative levels encourage student engagement and success. This reinforcement can include incentive programs, student praise and recognition strategies, all contributing to a supportive and encouraging school culture.',
				descriptors: [
					'The school has structured programs to highlight and honor desired behaviors from students (both) in the classroom and school-wide',
					'Visual representation of program is present in all applicable areas',
					'There is a system present for students to know where they are within the program',
					'Knowledge of how to acquire the incentive is known by all parties (Administration, Teachers, Staff, Students and Parents can recite)',
					'The program(s) successfully recognizes at least 50% of the school population',
					'There is a criteria established for students who do not qualify for major incentives to still earn some form of recognition',
					'There is a daily, weekly, monthly/quarterly and yearly incentive established'
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
					'Training has been provided to resolve conflict using appropriate proximity, eye-level, volume, and connotation',
					'There is an established conversation structure that allows all involved parties to speak respectfully',
					"Involved authority's priority is to listen and gain understanding",
					'Teachers are trained to remain calm, use neutral language, and avoid power struggles when conflicts arise',
					'Students are taught and encouraged to use peer mediation, active listening, and problem-solving techniques',
					'Teachers and students feel respected and supported when conflict arises',
					'Best peaceful resolution practices are discussed, developed and practiced by staff'
				]
			},
			{
				name: 'Student Concern Process',
				points: 6,
				description:
					'There is a process in place for students and/or parents to safely submit concerns from feeling unsafe, without fear of judgement or backlash from others.',
				descriptors: [
					'Process or system is visible in all common areas and/or regular communication tool',
					'The process to submit concerns is seamless and easily accessible',
					'The submitted concern can only be seen by appointed support personnel',
					'Appointed support personnel is versed in counseling techniques to navigate concern',
					'There is an established response time for submitted concerns to be addressed',
					'Knowledge of the process is known by all parties (students, staff, parents, community)'
				]
			},
			{
				name: 'Knowledge of Students',
				points: 3,
				description:
					"There is evidence that the administration, staff and educators know students' interests, family life, abilities, crisis', etc., and use that information to strengthen relationships.",
				descriptors: [
					'Student survey data is utilized to learn more about students interests, strengths, and challenges, both academically and non-academically, and files are regularly updated',
					'Scheduled and non-scheduled conversations between educators and students are encouraged and common, in whole-group and/or individual/small group settings',
					"Curriculum, content questions, etc. are modified based on knowledge of students' interests"
				]
			},
			{
				name: 'Endearment',
				points: 5,
				description:
					'School personnel utilizes encouraging language that shows students that he/she cares as a mentor figure. Verbal and non-verbal language displayed provides affirmations, encouragement, positive reinforcement, close ties, etc. with authenticity.',
				descriptors: [
					'Verbal terms of endearment are used regularly and consistently for all students by teachers, administrators and support staff',
					'Non-verbal forms of endearment are used regularly (head-nod, smile, high-five, etc.)',
					'Examples and/or training is provided to staff',
					'Staff is expected to verbalize appropriate salutations with students upon entering and exiting class',
					'Visual affirmations, encouragement, etc. are present in classrooms and high traffic areas'
				]
			},
			{
				name: 'Student-to-Student',
				points: 4,
				description:
					"There's a standard for student conversations to use appropriate language that encourages a positive and healthy culture. This standard of language uplifts, constructively criticizes when necessary and is inclusive.",
				descriptors: [
					'Explicit instruction for appropriate student-to-student conversation',
					'Visible talk structures are established for students to interact',
					'Scheduled supervised time for students to interact',
					'Positive reinforcement is utilized to encourage the continuation of desired respect and advocacy amongst students'
				]
			},
			{
				name: 'Caregiver Connection',
				points: 5,
				description:
					'A strong caregiver connection is made a priority at the school-wide and classroom level in order to promote attendance, citizenship and academic performance. Many systems are put in place to ensure the opportunity for relationship building from school personnel to caregiver.',
				descriptors: [
					'Initial contact and communication medium preferences are established with every caregiver (homeroom) within the first month of school by individual teachers',
					"Caregiver contracts are created and maintained with clear expectations for all stakeholders (i.e. desired caregiver involvement in the students' attendance, behavior, academics, etc.)",
					'1 positive call is required to the Caregiver(s) for each consequential call, and is monitored on a regular basis for all teachers & administrators',
					'Opportunities for caregivers to be present on campus (classes, events, parent volunteers, etc.) are available on a monthly basis, and encouraged regularly through some form of contact (teacher or school-wide)',
					'Caregivers and teachers conference about student performance on a quarterly/trimester basis'
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
					'Sub-objectives are explicitly planned within the lesson plan as to provide checkpoints towards mastery',
					'Scaffolding plans are included using proper task analysis and timing to reach desired outcome',
					'Lessons and/or units intentionally progress the skill through multiple Depth of Knowledge (DOK) levels',
					'Vocabulary recognition and application is explicit'
				]
			},
			{
				name: 'Real-Time Assessments',
				points: 7,
				description:
					"There are regular checks for understanding throughout the lesson to make sure the instructor is aware of students' current level of mastery. Students are given feedback and the opportunity to refine their thinking based on real-time assessments in order to be successful moving forward.",
				descriptors: [
					'Real-Time Assessments align with logical skill chunking (e.g., for determining unknown word meanings: first identifying context clues, then using background knowledge, and finally determining the meaning)',
					'RTAs have clear, visible expectations (written and verbally expressed)',
					'RTAs include modeling & provide an exemplar that is explicitly reviewed with students',
					'Timer is consistently utilized for task completion',
					'Students are randomly selected to answer questions, explain thinking, and create academic discourse',
					'Visible and easily accessible tracking for student mastery of the skill/standard being taught is consistently utilized',
					'2 or more real time assessments administered in each lesson per day'
				]
			},
			{
				name: 'Engagement',
				points: 5,
				description:
					'Lessons regularly engage students utilizing multiple tools and practices in order to maximize success for students.',
				descriptors: [
					'Physical and verbal cues utilized throughout lesson',
					'Instructors are expected to incorporate student interests and/or pop culture daily',
					'Instructors utilize technology regularly to enhance lessons and increase engagement',
					"Lessons relate to and incorporate students' realities",
					'Lessons purposefully and explicitly use all components of Gradual Release of Responsibility at intentional points of the lesson'
				]
			},
			{
				name: 'Assessments',
				points: 5,
				description:
					'Assess students regularly in order to determine mastery and areas of refinement as well as expose students to rigorous questions (content) & question types (format) present on summative and state tests.',
				descriptors: [
					'Assessment questions are planned and incorporated into every lesson',
					'Questions are structured to resemble state assessments, in order require the same skills',
					'Technology assessments are utilized regularly',
					'Performance is explicitly reviewed in order to determine areas of mastery and refinement',
					'Students are made aware of their current level of mastery on a consistent basis'
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
