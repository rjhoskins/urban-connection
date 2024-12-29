<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LayoutGrid, List, PenTool, Slice, UserRoundPlus } from 'lucide-svelte';
	const adminData = [
		{
			title: 'Create Organization',
			url: '/organizations/create',
			description: 'Create organization and send email invitation to administrator.',
			icon: UserRoundPlus
		},
		{
			title: 'Manage Organizations',
			url: '/organizations',
			description: 'Manage the details for all organizations',
			icon: LayoutGrid
		},
		{
			title: 'View Results Dashboard',
			url: '/organizations/results',
			description: 'View completed assessment results for all organizations',
			icon: List
		},
		{
			title: 'Manage Assessments',
			url: '/organizations/manage-assessments',
			description: 'Edit, view, and manage assessment',
			icon: PenTool
		}
	];
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title>Main Menu</Card.Title>
		<Card.Description>Card Description</Card.Description>
	</Card.Header>
	<Card.Content>
		{#each adminData.slice(0, 2) as item (item.title)}
			{@render dashItem(item)}
		{/each}

		<hr class="bg-primary" />

		{#each adminData.slice(2, adminData.length) as item (item.title)}
			{@render dashItem(item)}
		{/each}
	</Card.Content>
</Card.Root>

{#snippet dashItem(item: any)}
	<Card.Content>
		<a href={item.url} class="flex gap-3">
			<svelte:component this={item.icon} />
			<div class="space-y-2">
				<p>{item.title}</p>
				<p class="text-primary/50">{item.description}</p>
			</div>
		</a>
	</Card.Content>
{/snippet}
