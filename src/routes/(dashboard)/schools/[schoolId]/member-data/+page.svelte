<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import MemberSurveyResultsCard from '$lib/components/member-survey-results-card.svelte';

	let { data } = $props();
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
<h1 class=" py-3 text-center text-2xl">Teacher Data</h1>

<!-- <pre>{JSON.stringify(memberData, null, 2)}</pre> -->
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#if memberData.length > 0}
		{#each memberData as member, idx (member.id)}
			<MemberSurveyResultsCard {school} {member} {idx} />
		{/each}
	{:else}
		<p>No survey results available</p>
	{/if}
</div>
