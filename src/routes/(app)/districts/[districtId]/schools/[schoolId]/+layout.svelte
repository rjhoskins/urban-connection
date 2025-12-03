<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';

	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import { getScoreBackgroundColor } from '$lib/utils';
	import toast from 'svelte-french-toast';
	import { Stripe } from 'stripe';
	import { ulid } from 'ulid';
	import SchoolDashboardAssessmentStatsBars from '$lib/components/school-dashboard-assessment-stats-bars.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { stripeProducts, schoolWithAdmins, memberData, isSuperAdmin } = data;
	const products = $state(stripeProducts.data);
	let numMembersShown = $state(data.memberData.length);
	let isGridView = $state(true);
	const baseUrl = $derived.by(() => {
		if (
			browser &&
			(page.url.pathname.includes('results') || page.url.pathname.includes('member-data'))
		) {
			return page.url.pathname.split('/').slice(0, -1).join('/');
		} else {
			return '';
		}
	});

	let pageTitle = $state(`${schoolWithAdmins.name} | Dashboard`);
	onMount(() => {
		globals.setPageName(pageTitle);
	});

	function copyAsssessmentLink() {
		// todo: move to server
		console.log('copyAsssessmentLink');
	}

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
			category: 'Incomplete',
			value: assessmentsStartedPercentage,
			chartColor: '#C9B53D',
			labelColor: '#F9F5D8'
		}
	];

	async function handlePurchase({
		priceId,
		userId,
		schoolId
	}: {
		priceId: string | Stripe.Price | null | undefined;
		userId: string | null | undefined;
		schoolId: number | null | undefined;
	}) {
		const currUrl = window.location.href;
		console.log('Purchase button clicked', { priceId, userId, schoolId, currUrl });
		const response = await fetch('/api/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				price: priceId,
				userId,
				schoolId,
				success_url: currUrl
			})
		});
		const { url } = await response.json();
		window.location.href = url;
	}

	onMount(() => {
		globals.setPageName(schoolWithAdmins.name);
		console.log('/districts/[districtId]/schools/[schoolId]/ layout	', data);
	});
</script>

<!-- {#each schoolWithAdmins.admins as admin (admin.email)}
					<AdminContactDetailsCard {admin} />
					
				{/each} -->

<!-- <svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Manage ${school.name} School`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={`Manage ${school.name} School`} />
	<meta property="og:image" content="/img/urban-connection-logo.png" />
	<meta property="og:url" content={window.location.href} /w>
	<link rel="icon" href="/img/urban-connection-logo.png" type="image/png" />
</svelte:head> -->

<!-- <pre>{JSON.stringify(assessmentResultsData, null, 2)}</pre> -->
<h1 class="sr-only">Manage {schoolWithAdmins.name} School</h1>
<section class=" grid max-w-7xl auto-rows-[1fr_auto] grid-cols-2 gap-5">
	<div class="top mb-11 flex justify-between">
		<div class="left space-y-3">
			<div class="flex items-center justify-between gap-4 font-bold text-[#525252]">
				{#each schoolWithAdmins.admins as admin (admin.id)}
					<AdminContactDetailsCard {admin} />
				{/each}
			</div>

			<div class="btns flex gap-5">
				<Button
					href={`${page.url.origin}/districts/${schoolWithAdmins.districtId}/schools/${schoolWithAdmins.id}/invite-coadmin`}
					class="">Add School Admin</Button
				>
				{#if schoolWithAdmins.paid}
					<Button onclick={copyAsssessmentLink}>Copy Assessment Link</Button>
				{:else}
					{#each products as { default_price, name }}
						<Button
							onclick={() =>
								handlePurchase({
									priceId: default_price,
									userId: data.user?.id,
									schoolId: schoolWithAdmins.id
								})}>Purchase {name}</Button
						>
					{/each}
				{/if}
				<!-- <Button href={`${window.location.origin}/schools/${school.id}/send-assessment`} class=""
						>Mass Send Assessment</Button
					> -->
			</div>
		</div>
	</div>

	<Card.Root class=" row-start-2 rounded-md p-9 shadow-md ">
		<p class="font-display text-2xl font-bold text-black">Assessment Information</p>
		<DonutChart data={chartData} total={totalPointsPercentage} />
	</Card.Root>

	<Card.Root class="right row-start-2 flex flex-col gap-3 rounded-md p-9 shadow-md">
		<SchoolDashboardAssessmentStatsBars {chartData} {totalPointsPercentage} {totalAssessments} />

		<div class="buttons mt-4 flex items-center justify-between gap-2">
			<Button
				variant={`${!page.url.pathname.includes('results') ? 'secondary' : 'default'}`}
				href={`${page.url.origin}/districts/${schoolWithAdmins.districtId}/schools/${schoolWithAdmins.id}/results`}
				class="mb-4">Assessment Totals</Button
			>
			<Button
				variant={`${!page.url.pathname.includes('member-data') ? 'secondary' : 'default'}`}
				href={`${page.url.origin}/districts/${schoolWithAdmins.districtId}/schools/${schoolWithAdmins.id}/member-data`}
				class="mb-4">Assessments</Button
			>

			<!-- //member-data -->
			<!-- http://localhost:5173/districts/4/schools/14/results -->
			<!-- http://localhost:5173/districts/4/schools/14/member-data -->
		</div>
	</Card.Root>
</section>

<!-- <pre>{JSON.stringify(page.url.pathname, null, 2)}</pre> -->
<section class="max-w-7xl">
	{@render children?.()}
</section>
