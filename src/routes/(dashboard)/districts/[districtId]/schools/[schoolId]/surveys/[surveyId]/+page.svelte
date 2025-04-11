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
<h1 class=" py-3 text-center text-2xl">Assessment Totals</h1>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	{#if domainIds.size > 0}
		<div class="grid grid-cols-2 gap-4">
			{#each domainIds as domainId (domainId)}
				<DomainQuestionResultsCard {domainId} {assessmentResultsData} />
			{/each}
		</div>
	{:else}
		<p>No assessment results available</p>
	{/if}
</section>
