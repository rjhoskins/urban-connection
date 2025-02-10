<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	interface District {
		id: number;
		name: string;
		schools: unknown;
	}

	let { data }: { data: PageData } = $props();
	const { districts }: { districts: District[] } = data;

	let districtProgess = $state(null);
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All District</h1>

<section class=" container grid max-w-6xl grid-cols-schools-fluid gap-4 py-8">
	{#each data.districts as district (district.id)}
		{@render districtCard(district)}
	{/each}
</section>

{#snippet districtCard(district: any)}
	<Card.Root
		class={[
			district.schools.length === 0 ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
			'transition-shadow duration-300 hover:shadow-lg'
		]}
	>
		<Card.Header>
			<Card.Title>{district.name}</Card.Title>
			<Card.Description class={[district.schools.length === 0 ? 'text-red-700' : '']}>
				Schools {district.schools.length}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href={`${page.url.pathname}/${district.id}`}>View District</a
			>
			<div class="flex grow flex-col gap-2">
				<p class="">Assessment Progress</p>
				<Progress barBgColor="bg-green-700" value={districtProgess || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
<!-- <pre>{JSON.stringify(district, null, 2)}</pre> -->
