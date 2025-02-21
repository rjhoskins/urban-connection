<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createNewUserOrLoginSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance } from '$app/forms';

	let {
		data,
		currDomain,
		currSubDomain,
		handleNext = $bindable(),
		handlePrev = $bindable(),
		isFirstQuestion,
		surveyId
	} = $props();

	// let questions = formData[currDomain].subDomains[currSubDomain]

	let form = $state({
		name: '',
		yearsTeaching: '',
		subjectTaught: ''
	});

	let answer = $state('');
</script>

<!-- <pre>{JSON.stringify(formData[currDomain], null, 2)}</pre> -->

<form
	method="POST"
	id={data[currDomain].subDomains[currSubDomain].name}
	class="flex flex-col gap-2 p-2"
	use:enhance={({ formElement, formData, action, cancel }) => {
		console.log('formData', formData);
		return async ({ result, update }) => {
			update({ reset: false });
			console.log('result', result);
			if (result.type === 'success') {
				console.log('Success');
				handleNext();
			}
		};
	}}
>
	<input type="hidden" name="demographics" value="true" />
	<input type="hidden" name="surveyId" value={surveyId} />
	<!-- <pre>{JSON.stringify(form, null, 2)}</pre> -->
	{#each data[currDomain].subDomains[currSubDomain].fields as field (field.placeholder)}
		{#if field.type === 'select'}
			<div>
				<label for={field.fieldName} class="block text-sm/6 font-medium text-gray-900"
					>Location</label
				>
				<div class="mt-2 grid grid-cols-1">
					<select
						id={field.fieldName}
						name={field.fieldName}
						bind:value={form[field.fieldName as keyof typeof form]}
						class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
						bind:value={form[field.fieldName]}
						placeholder={field.placeholder}
						type={field.type}
						id={field.fieldName}
						maxlength="256"
						inputmode={field.type === 'number' ? 'numeric' : undefined}
						min={field.type === 'number' ? '1' : undefined}
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					/>
				</div>
			</div>
		{/if}
	{/each}
	<div class="flex gap-8 pt-2">
		<Button type="button" disabled={isFirstQuestion} onclick={() => handlePrev()} class="w-fit"
			>Previous</Button
		>

		<Button type="submit" formaction="?/submit" class="w-fit">Next</Button>
	</div>
</form>
