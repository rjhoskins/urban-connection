<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	import { TEST_RUBRIC_DATA2, RUBRIC_DATA } from '$lib/constants';

	let { data } = $props();
	let formData = $state(RUBRIC_DATA);
	let currDomain = $state(0);
	let currSubDomain = $state(0);
	let isFirstQuestion = $derived(currDomain === 0 && currSubDomain === 0);

	let isLastQuestion = $derived(
		formData.length == currDomain + 1 && formData[currDomain].subDomains.length == currSubDomain + 1
	);

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
		console.log('prev?');
	}
	function handleFinish() {
		console.log('Finish');
		goto('/thank-you');
	}
	$effect(() => {
		console.log('currDomain', currDomain);
		console.log('currSubDomain', currSubDomain);
		console.log('isFirstQuestion', isFirstQuestion);
		console.log('isLastQuestion', isLastQuestion);
	});
</script>

<section class="mx-auto max-w-7xl p-2 lg:p-8">
	<h1 class="sr-only">testing...</h1>

	<h2 class="my-3 text-center text-3xl font-bold">
		TESTING!!! |{formData[currDomain].name} |
		{formData[currDomain].subDomains[currSubDomain].name}
	</h2>

	<Card class="p-4 shadow-2xl">
		<div class="flex gap-4">
			<div class="aspect-w-16 aspect-h-9">
				{@html '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=6nBY3o9cLboe4jEd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'}
			</div>
			<div class="right w-full">
				<ul class="">
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
									next();
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
											name={formData[currDomain].subDomains[currSubDomain].descriptors[
												descriptorIdx
											].id}
											bind:group={formData[currDomain].subDomains[currSubDomain].descriptors[
												descriptorIdx
											].value}
											value={true}
											class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
										/>
										<span class="text-gray-700">Yes</span>
									</label>
									<label class="flex cursor-pointer items-center space-x-2">
										<input
											type="radio"
											name={formData[currDomain].subDomains[currSubDomain].descriptors[
												descriptorIdx
											].id}
											bind:group={formData[currDomain].subDomains[currSubDomain].descriptors[
												descriptorIdx
											].value}
											value={false}
											class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
										/>
										<span class="text-gray-700">No</span>
									</label>
								</div>
							</li>
						{/each}
						<div class="flex justify-between pt-2">
							<Button
								type="button"
								disabled={isFirstQuestion}
								onclick={() => previous()}
								class="w-fit">Previous</Button
							>
							{#if isLastQuestion}
								<Button
									type="submit"
									formaction="?/finish"
									onclick={() => handleFinish()}
									class="w-fit">Finish</Button
								>
							{:else}
								<Button type="submit" formaction="?/submit" class="w-fit">Next</Button>
							{/if}
						</div>
					</form>
				</ul>
			</div>
		</div>
	</Card>
</section>
