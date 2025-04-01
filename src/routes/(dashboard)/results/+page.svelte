<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	let { data }: { data: PageData } = $props();
	const { domainData, questionsData } = data;
</script>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	<h1 class="my-6 text-center text-3xl">All Time Totals</h1>
	<div class=" p-4">
		<div class="grid grid-cols-2 gap-4">
			{#each domainData as domain (domain.domainId)}
				<ul class="space-y-4">
					{@render domainCard({
						id: domain.domainId ?? 0,
						domainName: domain.domainName ?? '',
						pointsTotal: domain.pointsTotal,
						questionsTotal: domain.questionsTotal
					})}
					{#each questionsData.filter((q) => q.domainId === domain.domainId) as question (question.questionId)}
						{@render questionCard({
							questionId: question.questionId ?? 0,
							domainId: question.domainId ?? 0,
							pointsTotal: question.pointsTotal,
							questionsTotal: question.questionsTotal
						})}
					{/each}
				</ul>
			{/each}
		</div>
	</div>
</section>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

{#snippet domainCard(domain: {
	id: number;
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
	questionId: number;
	domainId: number;
	pointsTotal: number;
	questionsTotal: number;
})}
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-primary/90 text-xl">Question {question.questionId}</Card.Title>
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
