<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import Button from './ui/button/button.svelte';
	import { getScoreBackgroundColor } from '$lib/utils';

	const isNested = page.url.pathname.includes('districts');
	let { member, idx, showScore = false } = $props();
	const { id, name, status, completedAt, pointsTotal, questionsTotal } = member;
	const progress = $derived.by(() => {
		if (pointsTotal && questionsTotal) {
			return (pointsTotal / questionsTotal) * 100;
		} else {
			return 0;
		}
	});

	const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<Card.Root
	class="flex flex-col gap-6 px-5 py-2.5 transition-shadow duration-300 ease-in-out hover:shadow-lg	"
>
	<div class="top flex justify-between">
		<div class="flex flex-col gap-1">
			<p class="text-sm">{name}</p>
		</div>
	</div>
	<div class="bottom flex justify-between text-xs text-black/70">
		<div class="flex flex-col gap-2">
			<p>Completed:</p>
			{#if showScore}
				<p>Score:</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<p>
				{#if status !== 'completed'}
					NA
				{:else}
					{formattedDate}
				{/if}
			</p>
			{#if showScore}
				<p
					class={`md grid w-fit place-content-center rounded-md p-1 font-bold ${getScoreBackgroundColor(progress)}`}
				>
					{#if progress > 0}
						{Math.round(progress)}%
					{:else}
						NA
					{/if}
				</p>
			{/if}
		</div>
	</div>
</Card.Root>
