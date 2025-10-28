<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { getScoreBackgroundColor } from '$lib/utils';
	let { member, idx, page } = $props();
	let isNested = page.url.pathname.includes('districts');
	const { id, name, completedAt, pointsTotal, questionsTotal, assessmentCount } = member;
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

<Table.Row class="text-sm">
	<Table.Cell>
		{name}
	</Table.Cell>
	<Table.Cell>
		{assessmentCount}
	</Table.Cell>
	<Table.Cell>
		{#if progress}
			<div
				class={`md grid w-fit place-content-center rounded-md p-1 font-bold ${getScoreBackgroundColor(progress)}`}
			>
				{Math.round(progress)}%
			</div>
		{:else}-{/if}
	</Table.Cell>
	<Table.Cell class="text-right">
		<!-- class={`${progress === 0 ? ' pointer-events-none opacity-70' : ''}`} -->
		<Button href={isNested ? `${page.url.pathname}/schools/${id}` : `${page.url.pathname}/${id}`}>
			View School
		</Button>
	</Table.Cell>
</Table.Row>
