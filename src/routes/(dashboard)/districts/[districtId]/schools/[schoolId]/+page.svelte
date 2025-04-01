<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import MemberAssessmentResultsCard from '$lib/components/member-assessment-results-card.svelte';

	let { data } = $props();
	const { adminData, school, assessmentData, memberData } = data;

	const assessmentsNotStarted = assessmentData.filter(
		(assessment) => assessment.status === 'sent'
	).length;
	const assessmentsCompleted = assessmentData.filter(
		(assessment) => assessment.status === 'completed'
	).length;
	const totalAssessments = assessmentData.length;
	const assessmentsNotStartedPercentage = assessmentsNotStarted
		? (assessmentsNotStarted / totalAssessments) * 100
		: 0;
	const assessmentsCompletedPercentage = assessmentsCompleted
		? (assessmentsCompleted / totalAssessments) * 100
		: 0;
</script>

<h1 class="sr-only">Manage {school.name} School</h1>

<section class=" sizes mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
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
				<Button href={`${page.url.pathname}/results`} class="mb-4">View Results</Button>
				<Button href={`${page.url.pathname}/invite-coadmin`} class="">Add School Admin</Button>
				<Button href={`${page.url.pathname}/send-assessment`} class="mb-4">Send Assessment</Button>
				<div class="flex items-center justify-between">
					<div class="flex gap-2">
						<p>Total Assessments:</p>
						<p>{totalAssessments}</p>
					</div>
				</div>
				<p>Not Started</p>
				<Progress barBgColor="bg-red-700" value={assessmentsNotStartedPercentage} />
				<p>Completed</p>
				<Progress barBgColor="bg-green-700" value={assessmentsCompletedPercentage} />
			</div>
		</div>
	</Card.Root>

	<!-- <pre>{JSON.stringify(memberData, null, 2)}</pre> -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#if memberData.length > 0}
			{#each memberData as member, idx (member.id)}
				<MemberAssessmentResultsCard {member} {idx} />
			{/each}
		{:else}
			<p>No assessment results available</p>
		{/if}
	</div>
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
