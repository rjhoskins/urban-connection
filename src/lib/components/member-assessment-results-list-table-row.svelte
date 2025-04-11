<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { getScoreBackgroundColor } from '$lib/utils';
	let { member, idx, school, page, isNested = false } = $props();
	const { id, name, completedAt, pointsTotal, questionsTotal } = member;
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
		{school.name}
	</Table.Cell>
	<Table.Cell>
		{formattedDate}
	</Table.Cell>
	<Table.Cell>
		<div
			class={`md grid w-fit place-content-center rounded-md p-1 font-bold ${getScoreBackgroundColor(progress)}`}
		>
			{Math.round(progress)}%
		</div>
	</Table.Cell>
	<Table.Cell class="text-right">
		<Button
			class={`${progress === 0 ? ' pointer-events-none opacity-70' : ''}`}
			href={isNested
				? `${page.url.pathname}/assessments/${id}`
				: `${window.location.origin}/schools/${school.id}/assessments/${id}`}
		>
			View Details
		</Button>
	</Table.Cell>
</Table.Row>
