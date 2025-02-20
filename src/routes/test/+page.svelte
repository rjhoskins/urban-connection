<script lang="ts">
	// The teacher/ staff will need to enter their name, select a subject area from a drop-down (English, Math, etc. DC to provide), number of years experience)
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import NativeDemographicsSurveyForm from '$lib/components/forms/demographics-survey-form.svelte';
	import NativeSurveyFormTemplate from '$lib/components/forms/native-survey-form-template.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	import { TEST_RUBRIC_DATA2, RUBRIC_DATA, TEST_COMBINED_WITH_DEMOGRAPHICS } from '$lib/constants';

	let { data } = $props();
	let formData = $state(TEST_COMBINED_WITH_DEMOGRAPHICS);
	let currDomain = $state(0);
	let currSubDomain = $state(0);
	let isFirstQuestion = $derived(currDomain === 0 && currSubDomain === 0);

	let isLastQuestion = $derived(
		formData.length == currDomain + 1 && formData[currDomain].subDomains.length == currSubDomain + 1
	);

	const promptText =
		'Now, considering the information you read in the indicator summary, determine if each of the descriptors below are represented at your school. It is important to note that Descriptor scoring is not a measurement of perfection. If a descriptor is an expectation regularly expressed and supported by administration, select Yes. Othenelse, select No. Select Next after answering each descriptor.';

	function next() {
		if (
			formData.length == currDomain + 1 &&
			formData[currDomain].subDomains.length == currSubDomain + 1
		) {
			console.log('Finish');
			return;
		}
		// if (formData[currDomain].subDomains[currSubDomain].descriptors.some((d) => d.value === null)) {
		// 	console.log('Please answer all questions');
		// 	return;
		// }
		if (formData[currDomain].subDomains.length === currSubDomain + 1) {
			if (formData.length === currDomain + 1) {
				return;
			}
			currDomain += 1;
			currSubDomain = 0;
		} else {
			currSubDomain += 1;
		}
		console.log('Next?');
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
	function handleFinish() {
		console.log('Finish');
		goto('/thank-you');
	}
	// $effect(() => {
	// 	console.log('currDomain', currDomain);
	// 	console.log('currSubDomain', currSubDomain);
	// 	console.log('isFirstQuestion', isFirstQuestion);
	// 	console.log('isLastQuestion', isLastQuestion);
	// });
</script>

<section class="mx-auto max-w-7xl p-2 lg:p-8">
	<h1 class="sr-only">testing...</h1>

	<div class="flex flex-col gap-4 p-4">
		{#if formData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
			<Card class="p-2">
				{formData[currDomain].subDomains[currSubDomain].description}</Card
			>
		{:else}
			<div class="flex gap-8">
				<div class=" space-y-3">
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
						{#if formData[currDomain]?.subDomains[currSubDomain] && formData[currDomain]?.subDomains[currSubDomain]?.descriptors}
							{formData[currDomain].subDomains[currSubDomain].descriptors[0].text!}
						{/if}
					</p>
				</div>
				<div class="aspect-w-16 aspect-h-9">
					{@html '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=6nBY3o9cLboe4jEd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'}
				</div>
			</div>
			<Card class="p-2">
				{promptText}</Card
			>
		{/if}

		<Card class="flex max-w-prose gap-4 p-2">
			<div class="right w-full">
				<ul class="">
					{#if formData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
						<!-- <pre>{JSON.stringify(formData[currDomain], null, 2)}</pre> -->
						<NativeDemographicsSurveyForm
							data={formData}
							{currDomain}
							{currSubDomain}
							{isFirstQuestion}
							bind:handleNext={next}
							bind:handlePrev={previous}
						/>
					{:else}
						<NativeSurveyFormTemplate
							{formData}
							{currDomain}
							{currSubDomain}
							{isFirstQuestion}
							{isLastQuestion}
							bind:handleNext={next}
							bind:handlePrev={previous}
							bind:handleFin={handleFinish}
						/>
					{/if}
				</ul>
			</div>
		</Card>
	</div>
</section>
