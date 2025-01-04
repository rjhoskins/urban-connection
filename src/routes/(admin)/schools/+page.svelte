<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { users } from '$lib/store/users.svelte';

	let { data } = $props();
</script>

<h1 class="my-6 text-center text-3xl">{users.selectedUser}Manage All Schools</h1>

<section class=" grid-cols-schools-fluid container grid max-w-6xl gap-4">
	{#each data.data as school (school.name)}
		{@render ScholschoolCard(school)}
	{/each}
</section>

{#snippet ScholschoolCard(school: any)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{school.name}</Card.Title>
			<Card.Description class="flex gap-4 text-primary/50">
				Team Members{' '}
				{data.fetchedData.users?.filter(
					(user: { districtId: string }) => user?.districtId === school.id
				).length || 0}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex gap-3 p-4 ">
			<a
				class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href={`/schools/${school.slug}` || '/todo'}>View School</a
			>
			<div class="flex grow flex-col">
				<p class="">Assessment Progress</p>
				<Progress value={school?.progress || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<pre class="sizes">{JSON.stringify(data, null, 2)}</pre>
