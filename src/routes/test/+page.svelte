<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	import { TEST_RUBRIC_DATA2, RUBRIC_DATA } from '$lib/constants';

	let { data } = $props();
	let formData = $state(RUBRIC_DATA);
	let currDomain = $state(0);
	let currSubDomain = $state(0);
</script>

<section class="mx-auto max-w-7xl p-2 lg:p-8">
	<h1>testing...</h1>

	<h2 class="text-center text-3xl font-bold">
		{formData[currDomain].name} |
		{formData[currDomain].subDomains[currSubDomain].name}
	</h2>
	<div class="flex flex-col gap-8">
		{#each formData as { name: domainName, subDomains }, domainIdx (domainName)}
			<Card class="p-4 shadow-2xl">
				<ul>
					{#each subDomains as { name: subDomainName, descriptors, description }, subDomainIdx (subDomainName)}
						<li class="border-b border-gray-200 p-4">
							<h3 class="pb-2 text-center text-2xl font-bold">Domain: {domainName}</h3>
							<p class="pb-1 text-xl font-bold">Sub-domain: {subDomainName}</p>
							<p class="py-2 text-gray-600">{description}</p>
							<div class="flex gap-4">
								<div class="aspect-w-16 aspect-h-9">
									{@html '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=6nBY3o9cLboe4jEd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'}
								</div>
								<div class="right">
									<ul>
										<form
											method="POST"
											id={formData[domainIdx].subDomains[subDomainIdx].name}
											class="flex flex-col gap-2"
											use:enhance={({ formElement, formData, action, cancel }) => {
												// console.log('formElement', formElement);
												console.log('formData', formData);
												return async ({ result, update }) => {
													update({ reset: false });
													console.log('result', result);
												};
											}}
										>
											{#each descriptors as descriptor, descriptorIdx (descriptorIdx)}
												<li class="flex">
													<div class="flex flex-col gap-1.5">
														<p>
															{formData[domainIdx].subDomains[subDomainIdx].descriptors[
																descriptorIdx
															].text}
														</p>
														<label class="align-middlex flex cursor-pointer items-center space-x-2">
															<input
																type="radio"
																name={formData[domainIdx].subDomains[subDomainIdx].descriptors[
																	descriptorIdx
																].id}
																bind:group={formData[domainIdx].subDomains[subDomainIdx]
																	.descriptors[descriptorIdx].value}
																value={true}
																class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
															/>
															<span class="text-gray-700">Yes</span>
														</label>
														<label class="flex cursor-pointer items-center space-x-2">
															<input
																type="radio"
																name={formData[domainIdx].subDomains[subDomainIdx].descriptors[
																	descriptorIdx
																].id}
																bind:group={formData[domainIdx].subDomains[subDomainIdx]
																	.descriptors[descriptorIdx].value}
																value={false}
																class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
															/>
															<span class="text-gray-700">No</span>
														</label>
													</div>
												</li>
											{/each}
											<div class="flex justify-between pt-2">
												<Button class="  w-fit">Previous</Button>
												<Button class="  w-fit" type="submit"
													>{formData.length === domainIdx + 1 &&
													formData[domainIdx].subDomains.length == subDomainIdx + 1
														? 'Finish'
														: 'Next'}</Button
												>
											</div>
										</form>
									</ul>
								</div>
							</div>
						</li>
					{/each}
				</ul>
				<!-- <pre>{JSON.stringify(formData[domainIdx], null, 2)}</pre> -->
			</Card>
		{/each}
	</div>
</section>
