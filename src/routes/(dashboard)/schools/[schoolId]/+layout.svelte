<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { globals } from '$lib/store/globals.svelte';
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

	import toast from 'svelte-french-toast';
	import { createAssessmentInviteToken } from '$lib/utils';

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

	function copyAsssessmentLink() {
		const assessmentToken = createAssessmentInviteToken({
			sentBy: data.user?.id as string,
			schoolId: school.id
		});
		if (browser) {
			const assessmentLink = `${window.location.origin}/urban-connection-project-assessment?assessmentToken=${assessmentToken}`;
			navigator.clipboard.writeText(assessmentLink).then(
				() => {
					toast.success('Assessment link copied to clipboard!');
				},
				(err) => {
					toast.error('Could not copy text: ', err);
				}
			);
		}
	}
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
<section class=" grid max-w-7xl auto-rows-[1fr_auto] grid-cols-2 gap-5">
	<div class="top mb-11 flex justify-between">
		<div class="left space-y-3">
			<div class="flex items-center justify-between gap-4 font-bold text-[#525252]">
				{#if adminData.length === 1}
					<p class=" text-2xl">Administrator</p>
				{:else}
					<p class=" text-2xl">Administrators</p>
				{/if}
			</div>
			{#each adminData as admin (admin.adminEmail)}
				<AdminContactDetailsCard {admin} />
			{/each}
			{#if browser}
				<div class="btns flex gap-5">
					<Button href={`${window.location.origin}/schools/${school.id}/invite-coadmin`} class=""
						>Add School Admin</Button
					>
					<Button onclick={copyAsssessmentLink}>Copy Assessment Link</Button>
				</div>
			{/if}
		</div>
	</div>

	<Card.Root class=" row-start-2 rounded-md p-9 shadow-md ">
		<p class="font-display text-2xl font-bold text-black">Assessment Information</p>
		<DonutChart data={chartData} total={totalPointsPercentage} />
	</Card.Root>

	<Card.Root class="right row-start-2 flex flex-col gap-3 rounded-md p-9 shadow-md">
		<div class="buttons flex items-center justify-between gap-2"></div>
		<div class="flex items-center justify-between">
			<div class="flex gap-2">
				<p>Total Assessments:</p>
				<p>{totalAssessments}</p>
			</div>
		</div>
		{#each chartData as progress (progress.category)}
			{@render ProgressIndicator(progress)}
		{/each}

		<div class="">
			<div class="flex items-center justify-between">
				<p class="text-2xl text-black/70">Total Score</p>
				<p class="rounded-md bg-[#CCFFBD] px-1 py-0.5 text-xs">
					{Math.round(totalPointsPercentage)}%
				</p>
			</div>

			<Progress barBgColor="bg-[#34C759]" class="h-[7px]" value={totalPointsPercentage} />
		</div>
		{#if browser}
			<div class="buttons mt-4 flex items-center justify-between gap-2">
				<Button
					variant={`${!page.url.pathname.includes('results') ? 'secondary' : 'default'}`}
					href={`${window.location.origin}/schools/${school.id}/results`}
					class="mb-4">Assessment Totals</Button
				>
				<Button
					variant={`${!page.url.pathname.includes('member-data') ? 'secondary' : 'default'}`}
					href={`${window.location.origin}/schools/${school.id}/member-data`}
					class="mb-4">Members</Button
				>
			</div>
		{/if}
	</Card.Root>
</section>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<section class="max-w-7xl">
	{@render children?.()}
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
