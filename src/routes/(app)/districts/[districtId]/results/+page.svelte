<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const { districtData, domainData, questionsData } = data;
	let pageTitle = $state('Assessment Results | ' + districtData.name);

	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	<h1 class="sr-only">{districtData.name} All Time Assessment Results Totals</h1>
	<div class=" p-4">
		<div class="grid grid-cols-2 gap-4">
			{#if domainData.length !== 0}
				{#each domainData as domain (domain.domainId)}
					<ul class="space-y-4">
						{@render domainCard({
							id: domain.domainId ?? '',
							domainName: domain.domainName ?? '',
							pointsTotal: domain.pointsTotal,
							questionsTotal: domain.questionsTotal
						})}
						{#each questionsData.filter((q) => q.domainId === domain.domainId) as question (question.questionId)}
							{@render questionCard({
								questionId: question.questionId ?? '',
								domainId: question.domainId ?? '',
								pointsTotal: question.pointsTotal,
								questionsTotal: question.questionsTotal,
								questionText: question.questionText ?? ''
							})}
						{/each}
					</ul>
				{/each}
			{:else}
				<p class="text-center">No data available</p>
			{/if}
		</div>
	</div>
</section>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

{#snippet domainCard(domain: {
	id: string;
	domainName: string;
	pointsTotal: number;
	questionsTotal: number;
})}
	<Card.Root>
		<Card.Header>
			<Card.Title>{domain.domainName}</Card.Title>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			{#if domain.questionsTotal && domain.pointsTotal}
				<div class="flex grow flex-col gap-2">
					<div class="flex justify-between">
						<p>Score:</p>
						<p>{Math.round((domain.pointsTotal / domain.questionsTotal) * 100)}%</p>
					</div>
					<Progress
						barBgColor="bg-green-700"
						value={(domain.pointsTotal / domain.questionsTotal) * 100}
					/>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet questionCard(question: {
	questionId: string;
	domainId: string;
	pointsTotal: number;
	questionsTotal: number;
	questionText: string;
})}
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-xl text-black/90">Question {question.questionText}</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if question.questionsTotal && question.pointsTotal}
				<div class="flex grow flex-col gap-2">
					<div class="flex grow flex-col gap-2">
						<div class="flex justify-between">
							<p>Score:</p>
							<p>{Math.round((question.pointsTotal / question.questionsTotal) * 100)}%</p>
						</div>
					</div>
					<Progress
						barBgColor="bg-green-700"
						value={(question.pointsTotal / question.questionsTotal) * 100}
					/>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}
