<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { users } from '$lib/store/users.svelte';

	let { data } = $props();
	let schoolProgess;
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All Schools</h1>

<section class=" grid-cols-schools-fluid container grid max-w-6xl gap-4">
	{#each data.schools as school (school.id)}
		{@render ScholschoolCard(school)}
	{/each}
</section>

{#snippet ScholschoolCard(school: any)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{school.name}</Card.Title>
			<Card.Description class="flex gap-4 text-primary/50">
				Team Members{' '}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href={`${page.url.pathname}/${school.id}`}>View School</a
			>
			<div class="flex grow flex-col gap-2">
				<p class="">Assessment Progress</p>
				<Progress barBgColor="bg-green-700" value={schoolProgess || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<pre class="sizes">{JSON.stringify(data, null, 2)}</pre>
