<script lang="ts">
	// The teacher/ staff will need to enter their name, select a subject area from a drop-down (English, Math, etc. DC to provide), number of years experience)
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DemographicsAndAssessmentForm from '$lib/components/forms/demographics-and-assessment-form.svelte';

	import Card from '$lib/components/ui/card/card.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import { ASSESSMENT_PROGRESS_IMG_MAP } from '$lib/constants';
	import { currAssessment } from '$lib/store/assessment.svelte.js';
	import { onMount } from 'svelte';

	// http://localhost:5173/urban-connection-project-assessment?assessmentToken=RHVzdHl8ZHVzdHlAZW1haWwuY29tfDM2fDMz
	// http://localhost:5173/urban-connection-project-assessment?assessmentToken=OHwx

	let { data } = $props();
	const { assessmentToken, assessmentQuestions } = data;

	let formData = $state(assessmentQuestions);
	currAssessment.setAssessmentQuestions(assessmentQuestions);
	let currDomain = $state(0);
	let lastAnsweredQuestionIdInDomain = $state(0);
	let lastAnsweredQuestionIdInSubdomain = $state(0);
	// let currDomain = 1;
	let currSubDomain = $state(0);
	const totalQuestions = $derived(() => {
		let totalQuestions = 0;
		return totalQuestions;
	});
	const domains = assessmentQuestions
		.filter((domain) => domain.name.toLowerCase() !== 'demographics')
		.map((domain) => {
			return {
				name: domain.name,
				imgUrl: ASSESSMENT_PROGRESS_IMG_MAP.get(domain.name) || ''
				// status: 'not-started'
			};
		});

	let currQuestionsProgress = $derived(
		assessmentQuestions[currDomain].subDomains[currSubDomain].questions?.length || 0
	);
	const isDemographicsQuestions = $derived(
		formData[currDomain].subDomains[currSubDomain].name.toLowerCase() === 'demographics'
	);

	let isLastQuestion = $derived(
		formData.length == currDomain + 1 && formData[currDomain].subDomains.length == currSubDomain + 1
	);

	$effect(() => {
		console.log('currDomain => ', currDomain);
		console.log('currSubDomain => ', currSubDomain);
	});
	function applyCurrentProgress() {
		console.log('=============applyCurrentProgress==============');
		if (lastAnsweredQuestionIdInDomain && lastAnsweredQuestionIdInSubdomain) {
			const domainIndex = formData.findIndex(
				(domain) => domain.id === lastAnsweredQuestionIdInDomain
			);
			const subDomainIndex = formData[domainIndex].subDomains.findIndex(
				(subDomain: { id: number }) => subDomain.id === lastAnsweredQuestionIdInSubdomain
			);
			currDomain = domainIndex;
			currSubDomain = subDomainIndex;
		}
	}
	onMount(() => {
		console.log('page mounted');
		// console.log('OG assessmentQuestions', assessmentQuestions);
	});

	const promptText =
		'Now, considering the information you read in the indicator summary, determine if each of the descriptors below are represented at your school. It is important to note that Descriptor scoring is not a measurement of perfection. If a descriptor is an expectation regularly expressed and supported by administration, select Yes. Othenelse, select No. Select Next after answering each descriptor.';

	function next() {
		if (
			formData.length == currDomain + 1 &&
			formData[currDomain].subDomains.length == currSubDomain + 1
		) {
			return;
		}

		if (formData[currDomain].subDomains.length === currSubDomain + 1) {
			if (formData.length === currDomain + 1) {
				return;
			}
			currDomain += 1;
			currSubDomain = 0;
		} else {
			currSubDomain += 1;
		}
	}

	function previous() {
		if (currSubDomain === 0) {
			if (currDomain === 0) {
				return;
			}
			currDomain -= 1;
			currSubDomain = formData[currDomain].subDomains.length - 1;
		} else {
			currSubDomain -= 1;
		}
	}
</script>

<section class="mx-auto max-w-7xl space-y-5 p-2 lg:p-8">
	<h1 class="text-3xl">Culturally Responsive teaching Progress Monitoring Assessment</h1>
	{#if formData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
		<Card class="p-4 shadow-md">
			{formData[currDomain].subDomains[currSubDomain].description}
		</Card>
	{:else}
		<!-- TODO: PHASE 2 -->
		<!-- <Card class="p-4 shadow-md">
			<div class="flex grow flex-col gap-2 text-sm font-normal">
				<div class="flex grow flex-col gap-2">
					<div class="flex justify-between">
						<p>Assessment Progress</p>
						<p>{Math.round(0.5 * 100)}%</p>
					</div>
				</div>
				<Progress barBgColor="bg-primary" class="h-[9px]" value={0.5 * 100} />
			</div>
		</Card> -->
		<!-- TODO: PHASE 2 -->
		<div class="grid grid-cols-4 gap-4 py-4">
			{#each domains as domain (domain.name)}
				{@render AssessmentDomainProgressCard({ ...domain })}
			{/each}
		</div>
		{#if formData[currDomain].subDomains[currSubDomain].name}
			<div class="flex items-center gap-4">
				<p class="text-2xl font-bold">
					{formData[currDomain].subDomains[currSubDomain].name}
				</p>
				<p class="rounded-full bg-[#F9F5D8] p-2 py-1 text-sm font-normal text-[#371E98]">
					{formData[currDomain].subDomains[currSubDomain].questions?.length} points available
				</p>
			</div>
		{/if}

		<div class="grid grid-cols-2 gap-6">
			<div class="left col-span-1 flex flex-col gap-4 space-y-3">
				<div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-3xl">
					{@html '<iframe class="h-[315px] w-full" src="https://www.youtube.com/embed/ZrL_n3d6YOY?si=HvRNagTqeH0VsTx_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'}
				</div>

				<div class="rounded-md bg-[#EFF2FE]/50 p-4">
					<p class=" mb-9 text-2xl font-bold">Read the indicator summary below.</p>
					<p class="text-basetext-[#334155]">
						{#if formData[currDomain]?.subDomains[currSubDomain] && formData[currDomain]?.subDomains[currSubDomain]?.description}
							<p class="">{formData[currDomain].subDomains[currSubDomain].description!}</p>
						{/if}
					</p>
				</div>
			</div>
			<div class="">
				<p class="pb-8 text-2xl font-bold">{promptText}</p>
				<DemographicsAndAssessmentForm
					bind:demoAndAssessmentformData={formData}
					{currDomain}
					{currSubDomain}
					{assessmentToken}
					handleNext={next}
					handlePrev={previous}
					{isDemographicsQuestions}
					{isLastQuestion}
					formUpdatedAssessmentProgress={() => applyCurrentProgress()}
					bind:formLastAnsweredQuestionIdInDomain={lastAnsweredQuestionIdInDomain}
					bind:formLastAnsweredQuestionIdInSubdomain={lastAnsweredQuestionIdInSubdomain}
				/>
			</div>
		</div>
	{/if}
	{#if formData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
		<DemographicsAndAssessmentForm
			bind:demoAndAssessmentformData={formData}
			{currDomain}
			{currSubDomain}
			{assessmentToken}
			handleNext={next}
			handlePrev={previous}
			{isDemographicsQuestions}
			{isLastQuestion}
			formUpdatedAssessmentProgress={() => applyCurrentProgress()}
			bind:formLastAnsweredQuestionIdInDomain={lastAnsweredQuestionIdInDomain}
			bind:formLastAnsweredQuestionIdInSubdomain={lastAnsweredQuestionIdInSubdomain}
		/>
	{/if}

	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</section>

{#snippet AssessmentDomainProgressCard(domain: {
	name: string;
	imgUrl: string;
	status?: 'completed' | 'in-progress' | 'not-started' | '';
})}
	<Card
		class={`${domain.status == 'completed' ? 'bg-[#371E98]' : domain.status == 'in-progress' ? 'bg-[#EFF2FE]' : ''} flex flex-col gap-1 px-7 py-4 text-left `}
	>
		<img
			src={domain.imgUrl}
			alt={`${domain.name} progress indicator icon`}
			class="h-8 w-8"
			srcset=""
		/>
		<p
			class={`${domain.status == 'completed' ? 'text-white' : domain.status == 'in-progress' ? 'text-[#371E98]' : ''} text-lg `}
		>
			{domain.name}
		</p>
		<!-- <div class="text-sm">
			{#if domain.status == 'completed'}
				<p class="text-white">Completed</p>
			{:else if domain.status == 'in-progress'}
				<p class="">In Progress</p>
			{:else}
				<p class="">Coming up</p>
			{/if}
		</div> -->
	</Card>
{/snippet}
