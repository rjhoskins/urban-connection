<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { getScoreBackgroundColor } from '$lib/utils';
	import { onMount } from 'svelte';
	let { member, idx, page, showScore = false } = $props();
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
	onMount(() => {
		console.log('Member Row Data:', member);
	});
</script>

<Table.Row class="text-sm">
	<Table.Cell>
		<p class="text-sm">{name}</p>
	</Table.Cell>
	<Table.Cell>
		{#if status !== 'completed'}
			NA
		{:else}
			{formattedDate}
		{/if}
	</Table.Cell>
	{#if showScore}
		<Table.Cell class="text-right">
			<div class={`w-fit text-right ${getScoreBackgroundColor(progress)}`}>
				{#if progress}
					{Math.round(progress)}%
				{:else}
					-
				{/if}
			</div>
		</Table.Cell>
	{/if}
</Table.Row>
