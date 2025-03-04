<script lang="ts">
	import Card from './ui/card/card.svelte';
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

<Card class="space-y-3 p-4">
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
</Card>
