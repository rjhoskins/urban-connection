<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import DomainQuestionResultsCard from '$lib/components/assessment-question-results-domain-stats-card.svelte';

	let { data } = $props();
	const { adminData, school, assessmentData, assessmentResultsData } = data;

	const domainIds = new Set([...assessmentResultsData.map((result) => result.domainId)]);
	const totalAssessments = assessmentData.length;
	const assessmentsNotStarted = assessmentData.filter(
		(assessment) => assessment.status === 'sent'
	).length;
	const assessmentsCompleted = assessmentData.filter(
		(assessment) => assessment.status === 'completed'
	).length;
	const assessmentsNotStartedPercentage = assessmentsNotStarted
		? (assessmentsNotStarted / totalAssessments) * 100
		: 0;
	const assessmentsCompletedPercentage = assessmentsCompleted
		? (assessmentsCompleted / totalAssessments) * 100
		: 0;
</script>

<!-- <pre>{JSON.stringify(domainIdsArr, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(assessmentResultsData, null, 2)}</pre> -->
<h1 class="sr-only">View Assessment Detail</h1>

{#if domainIds.size > 0}
	<Card.Root class=" mb-4 flex justify-between p-4">
		{#if assessmentResultsData[0]?.participantName && assessmentResultsData[0]?.participantEmail}
			<p>Participant Name: {assessmentResultsData[0]?.participantName}</p>
			<p>Participant Email: {assessmentResultsData[0]?.participantEmail}</p>
		{:else}
			<p>Teacher Results</p>
		{/if}
	</Card.Root>
	<div class="grid grid-cols-2 gap-4">
		{#each domainIds as domainId (domainId)}
			<DomainQuestionResultsCard {domainId} {assessmentResultsData} />
		{/each}
	</div>
{:else}
	<p>No assessment results available</p>
{/if}

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
