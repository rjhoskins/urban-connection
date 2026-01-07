<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { ZERO_BASED_ALPHABET_NUMBERING } from '$lib/public-data/constants-public';
	import Input from '../ui/input/input.svelte';
	import toast from 'svelte-french-toast';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import { getModalStateContext } from '$lib/modal-state.svelte';
	const modal = getModalStateContext();

	import {
		applyAssessmentResponsesToQuestionsAndGetCurrentPositions,
		formDataToObject,
		logIfDev
	} from '$lib/utils';
	import { onMount } from 'svelte';

	let {
		assessmentformData = $bindable(),
		currDomain = $bindable(),
		currAssessmentData = $bindable(),
		currSubDomain = $bindable(),
		handleNext = $bindable(),
		handlePrev = $bindable(),
		formLastAnsweredQuestionIdInSubdomain = $bindable(),
		formLastAnsweredQuestionIdInDomain = $bindable(),
		formUpdatedAssessmentProgress,
		isFirstQuestion,
		isLastQuestion,
		assessmentId
	} = $props();

	async function handleIntermediateSubmit(
		event:
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLButtonElement;
			  })
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLAnchorElement;
			  })
	) {
		event.preventDefault();

		const form = event.currentTarget.closest('form');
		const formData = new FormData(form!);

		// formData.append('assessmentId'`);

		logIfDev('handleIntermediateSubmit data', formData);

		if (!form?.action) throw new Error('Form action is required');
		const response = await fetch(form.action, {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = deserialize(await response.text());

		handleNext();
		applyAction(result);
	}

	async function handleFinish(
		event:
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLButtonElement;
			  })
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLAnchorElement;
			  })
	) {
		event.preventDefault();
		logIfDev('handleFinish');

		const form = event.currentTarget.closest('form');
		const formData = new FormData(form!);
		// formData.append('assessmentId', `${currAssessment.currAssessmentId}`);
		formData.append('isLastQuestion', 'true');

		// handleFormDataChange({ event, data });

		if (!form?.action) throw new Error('Form action is required');
		const response = await fetch(form.action, {
			method: 'POST',
			body: formData
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
	}

	onMount(() => {
		// logIfDev('assessmentformData onMount', assessmentId);
	});
</script>

<!-- <pre>{JSON.stringify(assessmentformData[currDomain].subDomains[currSubDomain], null, 2)}</pre> -->
<div class="herz col-span-2">
	<form method="POST" id="assessmentForm" class="col-span-2 grid grid-cols-2 gap-2">
		<div class="col-span-2 grid grid-cols-2 gap-2">
			{#if isLastQuestion}
				<input type="hidden" name="isLastQuestion" value={true} />
			{/if}
			<input type="hidden" name="assessmentId" value={assessmentId} />
			<!-- assessment inputs -->
			{#each assessmentformData?.[currDomain]?.subDomains?.[currSubDomain]?.questions, questionIdx (questionIdx)}
				{@const inputName = `domainId=${assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}|subDomainId=${assessmentformData[currDomain].subDomains[currSubDomain].id}|qId=${assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}`}
				<Card class="question flex max-w-prose gap-4  p-8">
					<div class="flex flex-col gap-1.5">
						<p class="text-lg font-normal text-black/70">
							<span class="font-bold text-[#1E293B]"
								>{ZERO_BASED_ALPHABET_NUMBERING[
									questionIdx as keyof typeof ZERO_BASED_ALPHABET_NUMBERING
								]}{')'}</span
							>
							{assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].text}
						</p>
						<div class="inputs flex gap-8">
							<label class="align-middlex flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name={inputName}
									bind:group={
										assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx]
											.value
									}
									value={1}
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
								/>
								<input
									type="hidden"
									name={inputName}
									bind:group={
										assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx]
											.value
									}
									value={assessmentformData[currDomain].subDomains[currSubDomain].questions[
										questionIdx
									].value
										? assessmentformData[currDomain].subDomains[currSubDomain].questions[
												questionIdx
											].value
										: null}
								/>
								<span class="text-gray-700">Yes</span>
							</label>
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name={inputName}
									bind:group={
										assessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx]
											.value
									}
									value={0}
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-gray-700">No</span>
							</label>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<div class="col-span-2 flex justify-end gap-4 pt-2">
			{#if !isFirstQuestion}
				<Button type="button" onclick={(e) => handlePrev(e)} variant="outline" class="w-fit"
					>Previous</Button
				>
			{/if}
			{#if isLastQuestion}
				<Button type="submit" onclick={(e) => handleFinish(e)} class="w-fit">Finish</Button>
			{:else}
				<Button type="submit" onclick={(e) => handleIntermediateSubmit(e)} class="w-fit"
					>Next</Button
				>
			{/if}
		</div>
	</form>
</div>
