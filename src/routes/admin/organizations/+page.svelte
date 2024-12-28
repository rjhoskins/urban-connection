<script lang="ts">
	import AdminPanel from '$lib/components/AdminPanel.svelte';
	import { Root } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<h1>Manage All Organizations</h1>

<section class="grid-cols-orgs-fluid sizes sizes container grid max-w-7xl gap-4">
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
				{data.fetchedData.users?.filter((user) => user?.districtId === org.id).length || 0}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex p-4 ">
			<a class="grow" href={`/admin/organizations/${org.slug}` || '/todo'}>View Organization</a>
			<div class="flex grow flex-col">
				<p class="">Assessment Progress</p>
				<Progress value={org?.progress || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<pre>{JSON.stringify(page, null, 2)}</pre>
<pre class="sizes">{JSON.stringify(data, null, 2)}</pre>
