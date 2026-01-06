<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { onMount } from 'svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	import { page } from '$app/state';

	const globals = getGlobalsContext();

	interface District {
		id: string;
		name: string;
		schools: { id: string; name: string }[];
	}

	const { data }: { data: PageData } = $props();
	// ensure districts has a concrete type so the snippet's parameter is not unknown
	const { districts } = data as { districts: District[] };

	let pageTitle = $state('Manage Districts');

	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<h1 class="sr-only">{pageTitle}</h1>
<!-- <pre class="">{JSON.stringify(data, null, 2)}</pre> -->

<section class=" grid-cols-four-fluid grid max-w-6xl gap-4 py-8">
	{#if districts?.length === 0}
		<p class="col-span-full text-center text-lg">No districts found.</p>
	{/if}
	{#each districts as district (district?.id as District['id'])}
		{@render districtCard(district as District)}
	{/each}
</section>

<!-- {#snippet districtCard(district: District)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{district.name}</Card.Title>
		</Card.Header>
	</Card.Root>
{/snippet} -->

{#snippet districtCard(district: District)}
	<Card.Root
		class={[
			district.schools.length === 0 ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
			'transition-shadow duration-300 hover:shadow-lg'
		]}
	>
		<Card.Header>
			<Card.Title>{district.name}</Card.Title>
			<Card.Description class={[district.schools.length === 0 ? 'text-red-700' : '']}>
				Schools {district?.schools.length > 0
					? `(${district.schools.length})`
					: '(No member schools)'}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				href={`${page.url.pathname}/${district.id}`}>View District</a
			>
			<!-- TODO: FUTURE? -->
			<!-- {#if district.questionsTotal && district.pointsTotal}
				<div class="flex grow flex-col gap-2">
					<div class="flex justify-between">
						<p>Total Score:</p>
						<p>{Math.round((district.pointsTotal / district.questionsTotal) * 100)}%</p>
					</div>
					<Progress
						barBgColor="bg-green-700"
						value={(district.pointsTotal / district.questionsTotal) * 100}
					/>
				</div>
			{/if} -->
		</Card.Content>
	</Card.Root>
{/snippet}
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
