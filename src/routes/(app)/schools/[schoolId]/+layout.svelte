<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';

	import toast from 'svelte-french-toast';

	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import Stripe from 'stripe';
	import SchoolDashboardAssessmentStatsBars from '$lib/components/school-dashboard-assessment-stats-bars.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { stripeProducts = [], schoolWithAdmins = null, memberData = [], user = null } = data ?? {};
	const products = $state(stripeProducts || []);
	const validProducts = $state(products.filter((product) => product.lookupKey) || []);

	let pageTitle = $state(`${data?.schoolWithAdmins?.name ?? ''} | Dashboard`);
	$effect(() => {
		globals.setPageName(pageTitle);
		console.log('Layout data:', data);
	});
	// price_1Rz21gAAfGnMCvIQR4vLKG6G

	const memberList = Array.isArray(memberData) ? memberData : [];
	const totalAssessments = memberList.length || 0;
	const assessmentsNotStarted =
		memberList.filter((assessment) => assessment.status === 'sent').length || 0;
	const assessmentsStarted =
		memberList.filter((assessment) => assessment.status === 'started').length || 0;
	const assessmentsCompleted =
		memberList.filter((assessment) => assessment.status === 'completed').length || 0;
	const assessmentsNotStartedPercentage = assessmentsNotStarted
		? (assessmentsNotStarted / totalAssessments) * 100
		: 0;
	const assessmentsStartedPercentage = assessmentsStarted
		? (assessmentsStarted / totalAssessments) * 100
		: 0;
	const assessmentsCompletedPercentage = assessmentsCompleted
		? (assessmentsCompleted / totalAssessments) * 100
		: 0;

	const totalPoints = memberList.reduce(
		(acc: number, member: { pointsTotal?: number | null }) => acc + (member.pointsTotal ?? 0),
		0
	);
	const totaPossiblePoints = memberList.reduce(
		(acc: number, member: { questionsTotal?: number | null }) => acc + (member.questionsTotal ?? 0),
		0
	);
	const totalPointsPercentage =
		totaPossiblePoints > 0 ? Math.round((totalPoints / totaPossiblePoints) * 100) : 0;

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

	async function copyAsssessmentLink() {
		let resData;
		const schoolId = data?.schoolWithAdmins?.id;
		const createdBy = data?.user?.id;

		if (!schoolId || !createdBy) {
			toast.error('Missing required data to create assessment link.');
			return;
		}
		const res = await fetch('/api/create-assessment-invite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				schoolId,
				createdBy
			})
		});
		try {
			resData = await res.json();
		} catch (e) {
			toast.error('Unexpected server response while creating assessment link.');
			return;
		}

		console.log('Assessment invite created: ', resData);
		// todo: move to server
		if (!resData.success) {
			toast.error(
				`Error creating assessment link: ${resData.message}, try again later or contact your administrator.`
			);
			return;
		}
		const origin = browser ? window.location.origin : page.url.origin;
		const assessmentLink = `${origin}/assessment-welcome?assessmentInviteId=${resData?.data?.id}`;

		if (browser) {
			navigator.clipboard.writeText(assessmentLink).then(
				() => {
					toast.success('Assessment Invite link copied to clipboard!');
				},
				(err) => {
					toast.error('Could not copy text: ', err);
				}
			);
		}
	}

	async function handlePurchase({
		lookupKey,
		userId,
		schoolId
	}: {
		lookupKey: string | null | undefined;
		userId: string | null | undefined;
		schoolId: number | null | undefined;
	}) {
		console.log('Initiating purchase with', { lookupKey, userId, schoolId });
		if (!lookupKey || !userId || !schoolId) {
			toast.error('Missing purchase details. Please try again later.');
			return;
		}
		const currUrl = window.location.href;
		console.log('Current URL:', currUrl);
		console.log('Purchase button clicked', { lookupKey, userId, schoolId, currUrl });
		const response = await fetch('/api/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				lookupKey,
				userId,
				schoolId,
				success_url: currUrl
			})
		});
		try {
			const { url } = await response.json();
			if (!url) {
				toast.error('Checkout session could not be created.');
				return;
			}
			window.location.href = url;
		} catch (e) {
			toast.error('Unexpected server response while creating checkout session.');
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta property="og:title" content={pageTitle} />
	<meta property="og:image" content="/img/urban-connection-logo.png" />
	<meta property="og:url" content={page.url.href} />
	<link rel="icon" href="/img/urban-connection-logo.png" type="image/png" />
</svelte:head>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<h1 class="sr-only">Manage {data?.schoolWithAdmins?.name} School</h1>
<section class=" grid max-w-7xl auto-rows-[1fr_auto] grid-cols-2 gap-5">
	<div class="top mb-11 flex justify-between">
		<div class="left space-y-3">
			<div class="grid-rows-auto grid grid-cols-2 gap-8 font-bold text-[#525252]">
				{#each data?.schoolWithAdmins?.admins as admin (admin.id)}
					<AdminContactDetailsCard {admin} />
				{/each}
			</div>

			{#if browser}
				<div class="btns flex flex-wrap gap-5">
					<Button
						href={`${window.location.origin}/schools/${data?.schoolWithAdmins?.id}/invite-coadmin`}
						class="">Add School Admin</Button
					>
					{#if data?.schoolWithAdmins?.isPaid}
						<Button onclick={copyAsssessmentLink}>Copy Assessment Invite Link</Button>
					{:else}
						{#each products as product}
							<Button
								onclick={() =>
									handlePurchase({
										lookupKey: product.lookupKey ?? null,
										userId: data.user?.id,
										schoolId: data?.schoolWithAdmins?.id
									})}>Purchase {product?.name}</Button
							>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<Card.Root class=" row-start-2 rounded-md p-9 shadow-md ">
		<p class="font-display text-2xl font-bold text-black">Assessment Information</p>
		<DonutChart data={chartData} total={totalPointsPercentage} />
	</Card.Root>

	<Card.Root class="right row-start-2 flex flex-col gap-3 rounded-md p-9 shadow-md">
		<SchoolDashboardAssessmentStatsBars {chartData} {totalPointsPercentage} {totalAssessments} />
		{#if browser}
			<div class="buttons mt-4 flex items-center justify-between gap-2">
				<Button
					variant={`${!page.url.pathname.includes('results') ? 'secondary' : 'default'}`}
					href={`${window.location.origin}/schools/${data?.schoolWithAdmins?.id}/results`}
					class="mb-4">Assessment Totals</Button
				>
				<Button
					variant={`${!page.url.pathname.includes('member-data') ? 'secondary' : 'default'}`}
					href={`${window.location.origin}/schools/${data?.schoolWithAdmins?.id}/member-data`}
					class="mb-4">Assessments</Button
				>
			</div>
		{/if}
	</Card.Root>
</section>

<section class="max-w-7xl">
	{#if !data}
		<p>loading...</p>
	{:else}
		{@render children?.()}
	{/if}
</section>
