<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { getScoreBackgroundColor } from '$lib/utils';
	import { Button } from 'bits-ui';
	import Progress from '$lib/components/ui/progress/progress.svelte';

	const { chartData, totalPointsPercentage, totalAssessments } = $props();
</script>

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
		<p class={`rounded-md ${getScoreBackgroundColor(totalPointsPercentage)} px-1 py-0.5 text-xs`}>
			{Math.round(totalPointsPercentage)}%
		</p>
	</div>

	<Progress
		barBgColor={`${getScoreBackgroundColor(totalPointsPercentage)}`}
		class="h-[7px]"
		value={totalPointsPercentage}
	/>
</div>

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
