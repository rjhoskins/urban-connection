<script lang="ts">
	import { logIfDev } from '$lib/utils';
	import { Card } from '../ui/card';
	import { Input } from '../ui/input';
	import { Button } from '$lib/components/ui/button';
	import { deserialize, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { getModalStateContext } from '$lib/modal-state.svelte';
	import { onMount } from 'svelte';
	const modal = getModalStateContext();

	async function handleInitializeAssessment(
		event:
			| (SubmitEvent & {
					currentTarget: EventTarget & HTMLButtonElement;
			  })
			| (MouseEvent & {
					currentTarget: EventTarget & HTMLAnchorElement;
			  })
	) {
		event.preventDefault();

		const form = event.currentTarget.closest('form');
		// logIfDev('handleInitialize form', form);
		const data = new FormData(form!);
		logIfDev('handleInitialize data', data);

		const isDemographics = data.get('isDemographics');

		const name = data.get('name');

		const decodedeAssessmentToken = '(assessmentToken as string);';

		logIfDev('data', data);

		//data => server
		if (!form?.action) throw new Error('Form action is required');
		const response = await fetch(form.action, {
			method: 'POST',
			body: data
		});
		const result: ActionResult = deserialize(await response.text());
		logIfDev('initialize result', result);
		// fail init
		if (result.type !== 'success') {
			logIfDev('ERROR => initialize result', result);
			toast.error('There was an error starting the assessment. Check email or use link to resume');
			return;
		}
		//basically successful init

		logIfDev('SUCCESS => initialize result', result);
	}
	const { demographicsFields, assessmentInviteId } = $props();
	const demographics = demographicsFields.subDomains?.[0];
	onMount(() => {
		// logIfDev('demographicsFields', demographicsFields);
	});
</script>

<Card class="p-4 shadow-md">
	{demographics.description}
</Card>
<div class="flex items-baseline justify-items-center gap-4">
	<p>New Assessment Registration</p>
	<button
		type="button"
		onclick={() => {
			modal.isResumeAssessmentOpen = true;
			modal.isResumeAssessmentResume = true;
		}}
		class="text-sm text-blue-600 underline hover:cursor-pointer"
		>Already started an assessment?</button
	>
</div>

<form method="POST" id="demographicsForm" action="?/create" use:enhance class="flex flex-col gap-2">
	<input type="hidden" name="assessmentInviteId" value={assessmentInviteId} />
	<Card class="flex max-w-prose flex-col gap-4 p-4 shadow-md">
		<!-- demographics inputs -->
		{#each demographics.fields as field, i (field.placeholder)}
			{#if field.type === 'select'}
				<div class="">
					<label for={field.fieldName} class="block text-sm/6 font-medium text-gray-900"
						>{field.label}</label
					>
					<div class="grid grid-cols-1">
						<select
							id={field.fieldName}
							name={field.fieldName}
							bind:value={demographics.fields[i].value}
							class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						>
							<option value="" disabled selected={true}>{field.placeholder}</option>
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
				<div class="">
					<label for={field.fieldName} class="block text-sm/6 font-medium text-gray-900"
						>{field.label}</label
					>
					<div class="">
						<Input
							required={field?.required}
							name={field.fieldName}
							bind:value={demographics.fields[i].value}
							placeholder={field.placeholder}
							type={field.type}
							id={field.fieldName}
							maxlength={field.type === 'text' ? 256 : undefined}
							inputmode={field.type === 'number' ? 'numeric' : undefined}
							min={field.type === 'number' ? '1' : undefined}
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
					</div>
				</div>
			{/if}
		{/each}
	</Card>

	<div class="flex justify-end pt-3">
		<Button type="submit" class="w-fit">Start Assessment</Button>
	</div>
</form>
