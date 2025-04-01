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
			<div class="right space-y-3 md:min-w-96">
				<div class="flex items-center justify-between">
					<div class="flex gap-2">
						<p>Total Assessments:</p>
						<p>{totalAssessments}</p>
					</div>
				</div>
				<div class="space-y-2">
					<p>Not Started</p>
					<Progress barBgColor="bg-red-700" value={assessmentsNotStartedPercentage} />
				</div>
				<div class="space-y-2">
					<p>Completed</p>
					<Progress barBgColor="bg-green-700" value={assessmentsCompletedPercentage} />
				</div>
			</div>
		</div>
	</Card.Root>
	{#if domainIds.size > 0}
		{#if assessmentResultsData[0]?.participantName && assessmentResultsData[0]?.participantEmail}
			<Card.Root class=" flex justify-between p-4">
				<p>Participant Name: {assessmentResultsData[0]?.participantName}</p>
				<p>Participant Email: {assessmentResultsData[0]?.participantEmail}</p>
			</Card.Root>
		{/if}
		<div class="grid grid-cols-2 gap-4">
			{#each domainIds as domainId (domainId)}
				<DomainQuestionResultsCard {domainId} {assessmentResultsData} />
			{/each}
		</div>
	{:else}
		<p>No assessment results available</p>
	{/if}
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
