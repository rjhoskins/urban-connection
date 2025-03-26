<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import DomainQuestionResultsCard from '$lib/components/survey-question-results-domain-stats-card.svelte';

	let { data } = $props();
	const { adminData, school, surveyData, surveyResultsData } = data;

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
<h1 class=" py-3 text-center text-2xl">Survey Totals</h1>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
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
