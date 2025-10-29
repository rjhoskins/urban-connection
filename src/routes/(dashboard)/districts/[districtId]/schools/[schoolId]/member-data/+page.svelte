<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';

	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import { Grid2X2, List } from 'lucide-svelte';
	import MemberAssessmentResultsGridCard from '$lib/components/member-assessment-results-grid-card.svelte';
	import MemberAssessmentResultsListTable from '$lib/components/member-assessment-results-list-table.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { adminData, school, assessmentData, memberData } = data;
	let numMembersShown = $state(data.memberData.length);
	let isGridView = $state(true);

	let pageTitle = $state(`${school.name} | Dashboard`);
	onMount(() => {
		globals.setPageName(pageTitle);
	});

	const totalAssessments = assessmentData.length;
	const assessmentsNotStarted = assessmentData.filter(
		(assessment) => assessment.status === 'sent'
	).length;
	const assessmentsStarted = assessmentData.filter(
		(assessment) => assessment.status === 'started'
	).length;
	const assessmentsCompleted = assessmentData.filter(
		(assessment) => assessment.status === 'completed'
	).length;
	const assessmentsNotStartedPercentage = assessmentsNotStarted
		? (assessmentsNotStarted / totalAssessments) * 100
		: 0;
	const assessmentsStartedPercentage = assessmentsStarted
		? (assessmentsStarted / totalAssessments) * 100
		: 0;
	const assessmentsCompletedPercentage = assessmentsCompleted
		? (assessmentsCompleted / totalAssessments) * 100
		: 0;

	const totalPoints = memberData.reduce((acc, member) => acc + member.pointsTotal, 0);
	const totaPossiblePoints = memberData.reduce((acc, member) => acc + member.questionsTotal, 0);
	const totalPointsPercentage = Math.round((totalPoints / totaPossiblePoints) * 100) || 0;

	const chartData = [
		{
			category: 'Completed',
			value: assessmentsCompletedPercentage,
			chartColor: '#34C759',
			labelColor: '#CCFFBD'
		},
		{
			category: 'Started',
			value: assessmentsStartedPercentage,
			chartColor: '#C9B53D',
			labelColor: '#F9F5D8'
		},

		{
			category: 'Not Started',
			value: assessmentsNotStartedPercentage,
			chartColor: '#B23532',
			labelColor: '#FEF4F5'
		}
	];
</script>

<!-- <svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Manage ${school.name} School`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={`Manage ${school.name} School`} />
	<meta property="og:image" content="/images/urban-connection-logo.png" />
	<meta property="og:url" content={window.location.href} />
	<link rel="icon" href="/images/urban-connection-logo.png" type="image/png" />
</svelte:head> -->

<!-- <pre>{JSON.stringify(assessmentResultsData, null, 2)}</pre> -->
<h1 class="sr-only">Manage {school.name} School</h1>

<section class="max-w-7xl">
	<Card.Root class="mt-5 mb-14 flex justify-end gap-4 p-4">
		<Button
			class="flex items-center justify-center"
			variant={`${!isGridView ? 'default' : 'secondary'}`}
			onclick={() => (isGridView = false)}><List /><span>List</span></Button
		>
		<Button
			variant={`${isGridView ? 'default' : 'secondary'}`}
			class="flex items-center justify-center"
			onclick={() => (isGridView = true)}><Grid2X2 /><span>Grid</span></Button
		>
	</Card.Root>
	{#if isGridView}
		<div class="grid-cols-four-fluid grid gap-4">
			{#each data.memberData as member, idx (member.id)}
				<MemberAssessmentResultsGridCard {idx} {member} {school} />
			{/each}
		</div>
	{:else}
		<MemberAssessmentResultsListTable {school} {page} members={data.memberData} />
	{/if}

	<p class="text-primary mt-auto pt-4 text-[13.33px]">
		Showing {numMembersShown} of {data.memberData.length} entries
	</p>
</section>

{@render children?.()}

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

{#snippet ProgressIndicator(data: { category: any; value: any; chartColor: any; labelColor: any })}
	<div class="">
		<div class="flex items-center justify-between">
			<p class="text-2xl text-black/70">{data.category}</p>
			<p class={`rounded-md bg-[${data.labelColor}] px-1 py-0.5 text-xs`}>
				{Math.round(data.value)}%
			</p>
		</div>
		<Progress barBgColor={`bg-[${data.chartColor}]`} class="h-[7px]" value={data.value} />
	</div>
{/snippet}
