<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { updateFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { ZERO_BASED_ALPHABET_NUMBERING } from '$lib/constants';

	let {
		demoAndAssessmentformData = $bindable(),
		currDomain,
		currSubDomain,
		handleNext = $bindable(),
		handlePrev = $bindable(),
		isDemographicsQuestions,
		isLastQuestion,
		assessmentToken
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
		console.log('handleIntermediateSubmit', form);
		const data = new FormData(form!);

		if (!form?.action) throw new Error('Form action is required');
		const response = await fetch(form.action, {
			method: 'POST',
			body: data
		});
		const result: ActionResult = deserialize(await response.text());
		console.log('handleIntermediateSubmit RESULT', result);
		if (result.type === 'success' && result?.data?.isDemographics) {
			// rerun all `load` functions, following the successful update
			await updateFlash(page);
		}

		handleNext();
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
		console.log('handleFinish');

		const form = event.currentTarget.closest('form');
		const data = new FormData(form!);

		// handleFormDataChange({ event, data });

		if (!form?.action) throw new Error('Form action is required');
		const response = await fetch(form.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<!-- <pre>{JSON.stringify(demoAndAssessmentformData[currDomain].subDomains[currSubDomain], null, 2)}</pre> -->
<div class="">
	<form method="POST" id={'demoAndAssessmentForm'} class=" flex flex-col gap-2">
		{#if isDemographicsQuestions}
			<!-- ostensibly the first assessment Q -->
			<input type="hidden" name="isDemographics" value="true" />
		{/if}

		{#if isLastQuestion}
			<input type="hidden" name="isLastQuestion" value="true" />
		{/if}
		<input type="hidden" name="assessmentToken" value={assessmentToken} />

		{#if demoAndAssessmentformData[currDomain].subDomains[currSubDomain].name.toLowerCase() == 'demographics'}
			<Card class="max-w-prose  p-4 shadow-md">
				<!-- demographics inputs -->
				{#each demoAndAssessmentformData[currDomain].subDomains[currSubDomain].fields as field, i (field.placeholder)}
					{#if field.type === 'select'}
						<div>
							<label for={field.fieldName} class="block text-sm/6 font-medium text-gray-900"
								>{field.label}</label
							>
							<div class="mt-2 grid grid-cols-1">
								<select
									id={field.fieldName}
									name={field.fieldName}
									bind:value={
										demoAndAssessmentformData[currDomain].subDomains[currSubDomain].fields[i].value
									}
									class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								>
									<option value="" disabled selected>Select a subject</option>
									{#each field.options as option (option)}
										<option value={option.value}>
											{option.label}
										</option>
									{/each}
								</select>
								<svg
									class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
									viewBox="0 0 16 16"
									fill="currentColor"
									aria-hidden="true"
									data-slot="icon"
								>
									<path
										fill-rule="evenodd"
										d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</div>
					{:else}
						<div>
							<label for={field.fieldName} class="block text-sm/6 font-medium text-gray-900"
								>{field.label}</label
							>
							<div class="mt-2">
								<input
									name={field.fieldName}
									bind:value={
										demoAndAssessmentformData[currDomain].subDomains[currSubDomain].fields[i].value
									}
									placeholder={field.placeholder}
									type={field.type}
									id={field.fieldName}
									maxlength="256"
									inputmode={field.type === 'number' ? 'numeric' : undefined}
									min={field.type === 'number' ? '1' : undefined}
									class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>
					{/if}
				{/each}
			</Card>
		{:else}
			<!-- assessment inputs -->
			{#each demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions, questionIdx (questionIdx)}
				<Card class="question flex max-w-prose gap-4  p-8">
					<div class="flex flex-col gap-1.5">
						<p class="text-lg font-normal text-black/70">
							<span class="font-bold text-[#1E293B]"
								>{ZERO_BASED_ALPHABET_NUMBERING[
									questionIdx as keyof typeof ZERO_BASED_ALPHABET_NUMBERING
								]}{')'}</span
							>
							{demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
								questionIdx
							].text}
						</p>
						<div class="inputs flex gap-8">
							<label class="align-middlex flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name={`domainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}|subDomainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].id}|qId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}`}
									bind:group={
										demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
											questionIdx
										].value
									}
									value={1}
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
								/>
								<input
									type="hidden"
									name={`domainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}|subDomainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].id}|qId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}`}
									bind:group={
										demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
											questionIdx
										].value
									}
									value={demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
										questionIdx
									].value
										? demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
												questionIdx
											].value
										: null}
								/>
								<span class="text-gray-700">Yes</span>
							</label>
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name={`domainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}|subDomainId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].id}|qId=${demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[questionIdx].id}`}
									bind:group={
										demoAndAssessmentformData[currDomain].subDomains[currSubDomain].questions[
											questionIdx
										].value
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
		{/if}
		<div class="flex gap-8 pt-2">
			<Button
				type="button"
				variant="secondary"
				disabled={isDemographicsQuestions}
				onclick={() => handlePrev()}
				class="w-fit">Previous</Button
			>
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
