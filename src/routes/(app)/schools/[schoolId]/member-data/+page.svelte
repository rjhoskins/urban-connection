<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import { page } from '$app/state';
	import { onMount, type Snippet } from 'svelte';

	import { Grid2X2, List } from 'lucide-svelte';
	import MemberAssessmentResultsGridCard from '$lib/components/member-assessment-results-grid-card.svelte';
	import MemberAssessmentResultsListTable from '$lib/components/member-assessment-results-list-table.svelte';
	import type { LayoutData } from '../$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { schoolWithAdmins, memberData } = data;
	let numMembersShown = $state(data.memberData.length);
	let isGridView = $state(true);

	let pageTitle = $state(`${schoolWithAdmins.name} | Dashboard`);
	onMount(() => {
		globals.setPageName(pageTitle);
		console.log('Mounted member-data page for school:', data);
	});

	const totalAssessments = memberData.length;
	const assessmentsNotStarted = memberData.filter(
		(assessment) => assessment.status === 'sent'
	).length;
	const assessmentsStarted = memberData.filter(
		(assessment) => assessment.status === 'started'
	).length;
	const assessmentsCompleted = memberData.filter(
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

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Manage ${schoolWithAdmins.name} School`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={`Manage ${schoolWithAdmins.name} School`} />
	<meta property="og:image" content="/img/urban-connection-logo.png" />
	<meta property="og:url" content={page.url.href} />
	<link rel="icon" href="/img/urban-connection-logo.png" type="image/png" />
</svelte:head>

<h1 class="sr-only">Manage {schoolWithAdmins.name} School</h1>

<section class="max-w-7xl">
	<Card.Root class="my-4 flex justify-end gap-4 p-4">
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

	<!-- <pre>{JSON.stringify(memberData, null, 2)}</pre> -->
	{#if data.memberData.length === 0}
		<p class="text-center text-black/70">No assessment data available.</p>
	{:else}
		{#if isGridView}
			<div class="grid-cols-four-fluid grid gap-4">
				{#each data.memberData as member, idx (member.id)}
					<MemberAssessmentResultsGridCard school={schoolWithAdmins} {idx} {member} />
				{/each}
			</div>
		{:else}
			<MemberAssessmentResultsListTable {page} members={data.memberData} />
		{/if}

		<p class="text-primary mt-auto pt-4 text-[13.33px]">
			Showing {numMembersShown} of {data.memberData.length} entries
		</p>
	{/if}
</section>

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
