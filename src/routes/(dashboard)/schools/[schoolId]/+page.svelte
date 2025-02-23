<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';

	let { data } = $props();
	const {
		school: { name, schoolProgess },
		adminData,
		surveyData
	} = data;

	const totalSurveys = surveyData.length;
	const surveysNotStarted = surveyData.filter((survey) => survey.status === 'sent').length;
	const surveysStarted = surveyData.filter((survey) => survey.status === 'started').length;
	const surveysCompleted = surveyData.filter((survey) => survey.status === 'completed').length;
	const surveysNotStartedPercentage = surveysNotStarted
		? (surveysNotStarted / totalSurveys) * 100
		: 0;
	const surveysStartedPercentage = surveysStarted ? (surveysStarted / totalSurveys) * 100 : 0;
	const surveysCompletedPercentage = surveysCompleted ? (surveysCompleted / totalSurveys) * 100 : 0;
</script>

<!-- <pre>{JSON.stringify(surveyData, null, 2)}</pre> -->
<h1 class="sr-only">Manage {name} School</h1>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	<Card.Root class=" p-4">
		<div class="top flex justify-between">
			<div class="left space-y-3">
				<p class=" text-2xl font-semibold">{name} | Dashboard</p>
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
				<p>Started</p>
				<Progress barBgColor="bg-amber-500" value={surveysStartedPercentage} />
				<p>Completed</p>
				<Progress barBgColor="bg-green-700" value={surveysCompletedPercentage} />
			</div>
		</div>
	</Card.Root>
</section>
<!-- 
<pre class="">{JSON.stringify(data, null, 2)}</pre> -->
