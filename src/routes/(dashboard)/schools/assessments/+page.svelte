<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import DomainQuestionResultsCard from '$lib/components/survey-question-results-domain-stats-card.svelte';

	let { data } = $props();
	const { adminData, school, surveyData, surveyResultsData, questionData, domainResultsData } =
		data;

	const domainIdsArr = surveyResultsData.map((result) => result.domainId);

	const domainIds = new Set([...surveyResultsData.map((result) => result.domainId)]);
	const totalSurveys = surveyData.length;
	const surveysNotStarted = surveyData.filter((survey) => survey.status === 'sent').length;
	const surveysCompleted = surveyData.filter((survey) => survey.status === 'completed').length;
	const surveysNotStartedPercentage = surveysNotStarted
		? (surveysNotStarted / totalSurveys) * 100
		: 0;
	const surveysCompletedPercentage = surveysCompleted ? (surveysCompleted / totalSurveys) * 100 : 0;
</script>

<!-- <pre>{JSON.stringify(domainIdsArr, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(surveyResultsData, null, 2)}</pre> -->
<h1 class="sr-only">Manage {school.name} School</h1>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	<Card.Root class=" p-4">
		<div class="top flex justify-between">
			<div class="left space-y-3">
				<p class=" text-2xl font-semibold">{school.name} | Dashboard</p>
				{#if adminData.length === 1}
					<p class=" text-2xl">Administrator</p>
				{:else}
					<p class=" text-2xl">Administrators</p>
				{/if}
				{#each adminData as admin (admin.adminEmail)}
					<AdminContactDetailsCard {admin} />
				{/each}
			</div>
			<div class="right md:min-w-96">
				<div class="flex items-center justify-between">
					<div class="flex gap-2">
						<p>Total Surveys:</p>
						<p>{totalSurveys}</p>
					</div>
					<Button href={`${page.url.pathname}/send-assessment`} class="mb-4">Send Assessment</Button
					>
				</div>
				<p>Not Started</p>
				<Progress barBgColor="bg-red-700" value={surveysNotStartedPercentage} />
				<p>Completed</p>
				<Progress barBgColor="bg-green-700" value={surveysCompletedPercentage} />
			</div>
		</div>
	</Card.Root>
	{#if domainIds.size > 0}
		<div class="grid grid-cols-2 gap-4">
			{#each domainIds as domainId (domainId)}
				<DomainQuestionResultsCard {domainId} {surveyResultsData} />
			{/each}
		</div>
	{:else}
		<p>No survey results available</p>
	{/if}
</section>
<!-- 
<pre class="">{JSON.stringify(data, null, 2)}</pre> -->
