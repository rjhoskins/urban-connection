<script>
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	let { school, page, isNested = false } = $props();
	const { name, id, surveyCount, pointsTotal, questionsTotal } = school;
	const totalAssessmentScorePercentage = Math.floor((pointsTotal / questionsTotal) * 100) || 0;
</script>

<Card.Root class="transition-shadow duration-300 ease-in-out hover:shadow-lg">
	<Card.Header>
		<Card.Title>{name}</Card.Title>
		<Card.Description class="text-primary/50 flex gap-4">
			{#if surveyCount}
				<p>Assessments {surveyCount}</p>
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-3 p-4 ">
		<a
			class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			href={isNested ? `${page.url.pathname}/schools/${id}` : `${page.url.pathname}/${id}`}
			>View School</a
		>
		<div class="flex grow flex-col gap-2">
			{#if surveyCount > 0}
				<div class="flex justify-between">
					<p class="">Total Score:</p>
					<p class="">{totalAssessmentScorePercentage}%</p>
				</div>
				<Progress barBgColor="bg-green-700" value={totalAssessmentScorePercentage} />
			{:else}
				<p class="text-primary/50">No assessments taken yet</p>
			{/if}
		</div>
	</Card.Content>
	<!-- <pre>{JSON.stringify(page.url, null, 2)}</pre> -->
</Card.Root>
