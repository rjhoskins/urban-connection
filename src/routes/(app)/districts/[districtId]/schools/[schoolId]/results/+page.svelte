<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Grid2X2, List } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const { schoolData, domainData, questionsData } = data;
	let isSummaryView = $state(true);
</script>

<Card.Root class="my-4 flex justify-end gap-4 p-4">
	<Button
		class="flex items-center justify-center"
		variant={`${!isSummaryView ? 'default' : 'secondary'}`}
		onclick={() => (isSummaryView = false)}><List /><span>Detail</span></Button
	>
	<Button
		variant={`${isSummaryView ? 'default' : 'secondary'}`}
		class="flex items-center justify-center"
		onclick={() => (isSummaryView = true)}><Grid2X2 /><span>Summary</span></Button
	>
</Card.Root>
<div class=" mx-auto flex flex-col gap-4">
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
					{#if !isSummaryView}
						{#each questionsData.filter((q) => q.domainId === domain.domainId) as question (question.questionId)}
							{@render questionCard({
								questionId: question.questionId ?? '',
								domainId: question.domainId ?? '',
								pointsTotal: question.pointsTotal,
								questionsTotal: question.questionsTotal,
								questionText: question.questionText ?? ''
							})}
						{/each}
					{/if}
				</ul>
			{/each}
		{:else}
			<p>No data available</p>
		{/if}
	</div>
</div>

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
			<Card.Title class="text-xl text-black/90"
				>Question: "<span class="text-black/70">{question.questionText}</span>"</Card.Title
			>
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
