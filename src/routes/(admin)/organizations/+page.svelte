<script lang="ts">
	import AdminPanel from '$lib/components/admin-panel.svelte';
	import { Root } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<h1 class="my-6 text-center text-3xl">Manage All Organizations</h1>

<section class="sizes sizes container grid max-w-6xl grid-cols-orgs-fluid gap-4">
	{#each data.data as org (org.name)}
		{@render OrgCard(org)}
	{/each}
</section>

{#snippet OrgCard(org: any)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{org.name}</Card.Title>
			<Card.Description class="flex gap-4 text-primary/50">
				Team Members{' '}
				{data.fetchedData.users?.filter(
					(user: { districtId: string }) => user?.districtId === org.id
				).length || 0}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex gap-3 p-4 ">
			<a
				class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href={`/organizations/${org.slug}` || '/todo'}>View Organization</a
			>
			<div class="flex grow flex-col">
				<p class="">Assessment Progress</p>
				<Progress value={org?.progress || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<pre>{JSON.stringify(page, null, 2)}</pre>
<pre class="sizes">{JSON.stringify(data, null, 2)}</pre>
