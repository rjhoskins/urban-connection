<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	import QuestionsCard from '$lib/components/questions-card.svelte';

	let { surveyResultsData, domainId } = $props();
	const thisDomainDataSorted = surveyResultsData
		.filter((result) => result.domainId === domainId)
		.toSorted((a, b) => a.questionId - b.questionId);

	const totalDomainQuestions = thisDomainDataSorted.length;
	const DomainQuestionsArr = thisDomainDataSorted.reduce((acc, curr) => {
		if (acc.findIndex((item: any) => item.questionId === curr.questionId) !== -1) {
			acc[acc.findIndex((item: any) => item.questionId === curr.questionId)].questions.push(curr);
		} else {
			acc.push({ questionId: curr.questionId, questions: [curr] });
		}

		return acc;
	}, []);

	const validDomainAnswersArr = thisDomainDataSorted.reduce((acc, curr) => {
		if (
			acc.findIndex((item: any) => item.questionId === curr.questionId) !== -1 &&
			curr.questionisValidSubdomainGroup
		) {
			acc[acc.findIndex((item: any) => item.questionId === curr.questionId)].questions.push(curr);
		} else if (curr.questionisValidSubdomainGroup) {
			acc.push({ questionId: curr.questionId, questions: [curr] });
		}

		return acc;
	}, []);
	const totalDomainScore =
		thisDomainDataSorted
			.filter((el) => el.questionisValidSubdomainGroup)
			.reduce((acc, curr) => (acc += curr.questionResponse), 0) / totalDomainQuestions;
</script>

<Card.Root class="space-y-3 p-4">
	<h3 class="my-1 text-2xl font-light tracking-wide">
		{thisDomainDataSorted[0].domainName}
	</h3>
	<div class="flex justify-between">
		<p>Score</p>
		<p>{Math.floor(totalDomainScore * 100)}%</p>
	</div>
	<Progress barBgColor="bg-green-700" value={totalDomainScore * 100} />

	<div class="my-3">
		<!-- <p class="my-3 text-xl">Questions</p> -->
	</div>
	<div class="space-y-4">
		{#each DomainQuestionsArr as questionSet (questionSet.questionId)}
			<!-- <QuestionsCard questions={questionSet} /> -->
		{/each}
	</div>
</Card.Root>

{#snippet domainCard(district: any)}
	<Card.Root
		class={[
			district.memberSchoolsCount === 0 ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
			'transition-shadow duration-300 hover:shadow-lg'
		]}
	>
		<Card.Header>
			<Card.Title>{district.name}</Card.Title>
			<Card.Description class={[district.memberSchoolsCount === 0 ? 'text-red-700' : '']}>
				Schools {district.memberSchoolsCount}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				href={`${page.url.pathname}/${district.id}`}>View District</a
			>
			{#if district.questionsTotal && district.pointsTotal}
				<div class="flex grow flex-col gap-2">
					<p class="">Assessment Progress</p>
					<Progress
						barBgColor="bg-green-700"
						value={(district.pointsTotal / district.questionsTotal) * 100}
					/>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}
