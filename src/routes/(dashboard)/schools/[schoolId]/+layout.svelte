<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import MemberSurveyResultsCard from '$lib/components/member-survey-results-card.svelte';
	import { browser } from '$app/environment';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { adminData, school, surveyData, memberData } = data;

	const totalSurveys = surveyData.length;
	const surveysNotStarted = surveyData.filter((survey) => survey.status === 'sent').length;
	const surveysCompleted = surveyData.filter((survey) => survey.status === 'completed').length;
	const surveysNotStartedPercentage = surveysNotStarted
		? (surveysNotStarted / totalSurveys) * 100
		: 0;
	const surveysCompletedPercentage = surveysCompleted ? (surveysCompleted / totalSurveys) * 100 : 0;
	const totalPoints = memberData.reduce((acc, member) => acc + member.pointsTotal, 0);
	const totaPossiblePoints = memberData.reduce((acc, member) => acc + member.questionsTotal, 0);
	const totalPointsPercentage = Math.floor((totalPoints / totaPossiblePoints) * 100) || 0;
</script>

<!-- <pre>{JSON.stringify(surveyResultsData, null, 2)}</pre> -->
<h1 class="sr-only">Manage {school.name} School</h1>
<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	{#if browser}
		<Card.Root class=" p-4">
			<div class="top flex justify-between">
				<div class="left space-y-3">
					<p class=" text-2xl font-semibold">{school.name} | Dashboard</p>
					<div class="flex justify-between">
						{#if adminData.length === 1}
							<p class=" text-2xl">Administrator</p>
						{:else}
							<p class=" text-2xl">Administrators</p>
						{/if}
					</div>
					{#each adminData as admin (admin.adminEmail)}
						<AdminContactDetailsCard {admin} />
					{/each}
				</div>
				<div class="right flex flex-col gap-3 md:min-w-96">
					<div class="buttons flex items-center justify-between gap-2">
						<Button href={`${window.location.origin}/schools/${school.id}/send-assessment`} class=""
							>Send Assessment</Button
						>
						<Button href={`${window.location.origin}/schools/${school.id}/invite-coadmin`} class=""
							>Add School Admin</Button
						>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex gap-2">
							<p>Total Surveys:</p>
							<p>{totalSurveys}</p>
						</div>
					</div>
					<div class="">
						<p>Sent</p>
						<Progress barBgColor="bg-red-700" value={surveysNotStartedPercentage} />
					</div>
					<div class="">
						<p>Completed</p>
						<Progress barBgColor="bg-green-700" value={surveysCompletedPercentage} />
					</div>
					<div class="">
						<p class="flex justify-between">
							<span>Total Score</span>
							<span>{totalPointsPercentage}% </span>
						</p>
						<Progress barBgColor="bg-green-700" value={totalPointsPercentage} />
					</div>
					<div class="buttons flex items-center justify-between gap-2">
						<Button href={`${window.location.origin}/schools/${school.id}/results`} class="mb-4"
							>View Assessment Totals</Button
						>
						<Button href={`${window.location.origin}/schools/${school.id}/member-data`} class="mb-4"
							>View Members</Button
						>
					</div>
				</div>
			</div>
		</Card.Root>
	{/if}
	<div class="">{@render children?.()}</div>

	<!-- <pre class="">{JSON.stringify(page, null, 2)}</pre> -->
	<!-- <pre class="">{JSON.stringify(data, null, 2)}</pre> -->
</section>
