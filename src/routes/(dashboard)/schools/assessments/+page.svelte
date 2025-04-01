<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import DomainQuestionResultsCard from '$lib/components/assessment-question-results-domain-stats-card.svelte';

	let { data } = $props();
	const {
		adminData,
		school,
		assessmentData,
		assessmentResultsData,
		questionData,
		domainResultsData
	} = data;

	const domainIdsArr = assessmentResultsData.map((result) => result.domainId);

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
						<p>Total Assessments:</p>
						<p>{totalAssessments}</p>
					</div>
					<Button href={`${page.url.pathname}/send-assessment`} class="mb-4">Send Assessment</Button
					>
				</div>
				<p>Not Started</p>
				<Progress barBgColor="bg-red-700" value={assessmentsNotStartedPercentage} />
				<p>Completed</p>
				<Progress barBgColor="bg-green-700" value={assessmentsCompletedPercentage} />
			</div>
		</div>
	</Card.Root>
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
<!-- 
<pre class="">{JSON.stringify(data, null, 2)}</pre> -->
