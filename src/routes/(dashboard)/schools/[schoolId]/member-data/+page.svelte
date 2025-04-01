<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import MemberAssessmentResultsCard from '$lib/components/member-assessment-results-card.svelte';

	let { data } = $props();
	const { adminData, school, assessmentData, memberData } = data;

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
	const totalPoints = memberData.reduce((acc, member) => acc + member.pointsTotal, 0);
	const totaPossiblePoints = memberData.reduce((acc, member) => acc + member.questionsTotal, 0);
	const totalPointsPercentage = Math.round((totalPoints / totaPossiblePoints) * 100) || 0;
</script>

<!-- <pre>{JSON.stringify(assessmentResultsData, null, 2)}</pre> -->
<h1 class=" py-3 text-center text-2xl">Teacher Data</h1>

<!-- <pre>{JSON.stringify(memberData, null, 2)}</pre> -->
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#if memberData.length > 0}
		{#each memberData as member, idx (member.id)}
			<MemberAssessmentResultsCard {school} {member} {idx} />
		{/each}
	{:else}
		<p>No assessment results available</p>
	{/if}
</div>
