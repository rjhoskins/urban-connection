<script lang="ts">
	import Card from './ui/card/card.svelte';
	import Progress from './ui/progress/progress.svelte';

	let { questions: assessmentResponseQuestions } = $props();

	//     {
	//   "assessmentId": 1,
	//   "domainId": 7,
	//   "domainName": "Systems",
	//   "questionId": 9,
	//   "questionResponse": 1,
	//   "questionisValidSubdomainGroup": true,
	//   "subDomainId": 7,
	//   "subName": "Systemic Expectations"
	// }
	const totalDomainQuestions = assessmentResponseQuestions.questions.length;
	const questionTotalPoints = assessmentResponseQuestions.questions
		.map((el) => el.questionResponse)
		.reduce((acc, curr) => (acc += curr), 0);
</script>

<div class="">
	<p>Question {assessmentResponseQuestions.questionId}</p>

	<Progress barBgColor="bg-green-700" value={(questionTotalPoints / totalDomainQuestions) * 100} />
</div>
