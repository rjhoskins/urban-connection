<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let {
		formData,
		currDomain,
		currSubDomain,
		handleNext = $bindable(),
		handlePrev = $bindable(),
		handleFin = $bindable(),
		isFirstQuestion,
		isLastQuestion
	} = $props();
</script>

<form
	method="POST"
	id={formData[currDomain].subDomains[currSubDomain].name}
	class=" flex flex-col gap-2"
	use:enhance={({ formElement, formData, action, cancel }) => {
		// console.log('formElement', formElement);
		console.log('formData', formData);
		return async ({ result, update }) => {
			update({ reset: false });
			console.log('action', action);
			console.log('formElement', formElement);
			console.log('result', result);
			if (result.type === 'success') {
				console.log('Success');
				handleNext();
			}
		};
	}}
>
	{#each formData[currDomain].subDomains[currSubDomain].descriptors as descriptor, descriptorIdx (descriptorIdx)}
		<li class="flex">
			<div class="flex flex-col gap-1.5">
				<p>
					{formData[currDomain].subDomains[currSubDomain].descriptors[descriptorIdx].text}
				</p>
				<label class="align-middlex flex cursor-pointer items-center space-x-2">
					<input
						type="radio"
						name={formData[currDomain].subDomains[currSubDomain].descriptors[descriptorIdx].id}
						bind:group={formData[currDomain].subDomains[currSubDomain].descriptors[descriptorIdx]
							.value}
						value={true}
						class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-700">Yes</span>
				</label>
				<label class="flex cursor-pointer items-center space-x-2">
					<input
						type="radio"
						name={formData[currDomain].subDomains[currSubDomain].descriptors[descriptorIdx].id}
						bind:group={formData[currDomain].subDomains[currSubDomain].descriptors[descriptorIdx]
							.value}
						value={false}
						class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-700">No</span>
				</label>
			</div>
		</li>
	{/each}
	<div class="flex gap-8 pt-2">
		<Button type="button" disabled={isFirstQuestion} onclick={() => handlePrev()} class="w-fit"
			>Previous</Button
		>
		{#if isLastQuestion}
			<Button type="submit" formaction="?/finish" onclick={() => handleFin()} class="w-fit"
				>Finish</Button
			>
		{:else}
			<Button type="submit" formaction="?/submit" class="w-fit">Next</Button>
		{/if}
	</div>
</form>
