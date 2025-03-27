<script lang="ts">
	// The teacher/ staff will need to enter their name, select a subject area from a drop-down (English, Math, etc. DC to provide), number of years experience)
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DemographicsAndSurveyForm from '$lib/components/forms/demographics-and-survey-form.svelte';
	import NativeDemographicsSurveyForm from '$lib/components/forms/NOTUSINGdemographics-survey-form.svelte';
	import NativeSurveyFormTemplate from '$lib/components/forms/NOTUSINGnative-survey-form-template.svelte';

	import Card from '$lib/components/ui/card/card.svelte';

	let { data } = $props();
	const { assessmentToken, surveyData } = data;
	let formData = $state(surveyData);
	let currDomain = $state(0);
	let currSubDomain = $state(0);
	const isDemographicsQuestions = $derived(
		formData[currDomain].subDomains[currSubDomain].name.toLowerCase() === 'demographics'
	);
	let isFirstQuestion = $derived(currDomain === 0 && currSubDomain === 0);

	let isLastQuestion = $derived(
		formData.length == currDomain + 1 && formData[currDomain].subDomains.length == currSubDomain + 1
	);

	$effect(() => {
		console.log('formData', formData);
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
	<h1 class="sr-only">testing...</h1>
	{#if formData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
		<Card class="p-4 shadow-md">
			{formData[currDomain].subDomains[currSubDomain].description}</Card
		>
	{:else}
		<div class="flex gap-8">
			<div class="space-y-3">
				<h2 class="text-right text-3xl font-bold">
					<p class=" flex justify-end gap-2">
						<span class="block font-normal">Domain: </span>{formData[currDomain].name}
					</p>
					<p class=" flex justify-end gap-2">
						{#if formData[currDomain].subDomains[currSubDomain].name}
							<span class="block font-normal">Sub-domain:</span>{formData[currDomain].subDomains[
								currSubDomain
							].name}
						{/if}
					</p>
				</h2>

				<p class=" font-bold">Read the indicator summary below.</p>
				<p class="">
					{#if formData[currDomain]?.subDomains[currSubDomain] && formData[currDomain]?.subDomains[currSubDomain]?.description}
						<p class="">{formData[currDomain].subDomains[currSubDomain].description!}</p>
					{/if}
				</p>
			</div>
			<div class="aspect-w-16 aspect-h-9">
				{@html '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZrL_n3d6YOY?si=HvRNagTqeH0VsTx_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'}
			</div>
		</div>
		<Card class="p-2">
			{promptText}</Card
		>
	{/if}

	<DemographicsAndSurveyForm
		bind:demoAndSurveyformData={formData}
		{currDomain}
		{currSubDomain}
		{assessmentToken}
		handleNext={next}
		handlePrev={previous}
		{isDemographicsQuestions}
		{isLastQuestion}
	/>
</section>
