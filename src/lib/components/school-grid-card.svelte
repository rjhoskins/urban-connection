<script>
	import * as Card from '$lib/components/ui/card';
	import { getScoreBackgroundColor } from '$lib/utils';
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';
	import Progress from './ui/progress/progress.svelte';
	let { school, page } = $props();
	const { name, id, assessmentCount, pointsTotal, questionsTotal } = school;
	const totalAssessmentScorePercentage = Math.round((pointsTotal / questionsTotal) * 100) || 0;

	const scoreColor = getScoreBackgroundColor(totalAssessmentScorePercentage);
	const isNested = page.url.pathname.includes('districts');
</script>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<Card.Root
	class="flex flex-col gap-6 px-4 py-2.5 transition-shadow duration-300 ease-in-out hover:shadow-lg"
>
	<div class="top flex justify-between">
		<div class="left flex flex-col justify-between">
			<p class="text-sm font-semibold text-[#030229]">{name}</p>
			<div class="text-primary/50 flex gap-4 text-xs">
				{#if assessmentCount}
					<p>Assessments {assessmentCount}</p>
				{/if}
			</div>
		</div>
		{#if isNested}
			<Button href={`${page.url.pathname}/schools/${id}`}>View School</Button>
		{/if}
	</div>

	<div class="bottom flex grow flex-col gap-2">
		{#if assessmentCount > 0}
			<div class="flex justify-between text-sm text-black/70">
				<p class="">Total Score:</p>
				<p
					class={`rounded-md
					${getScoreBackgroundColor(totalAssessmentScorePercentage)}
					px-1
					py-0.5`}
				>
					{totalAssessmentScorePercentage}%
				</p>
			</div>
			<Progress
				barBgColor={`${getScoreBackgroundColor(totalAssessmentScorePercentage)}`}
				class="h-[7px]"
				value={totalAssessmentScorePercentage}
			/>
		{:else}
			<p class="text-primary/50">No assessments taken yet</p>
		{/if}
	</div>

	<!-- <pre>{JSON.stringify(page.url, null, 2)}</pre> -->
</Card.Root>
