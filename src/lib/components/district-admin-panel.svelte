<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LayoutGrid, List, PenTool, Slice, UserRoundPlus } from 'lucide-svelte';
	import { users } from '$lib/store/users.svelte';

	const adminData = [
		{
			title: 'Invite School Administator',
			url: '/schools/create',
			description: 'Send email invitation to administrator.',
			icon: LayoutGrid
		},
		{
			title: 'View Schools Dashboard',
			url: '/schools',
			description: 'View completed assessment results for all Schools',
			icon: List
		}
		// {
		// 	title: 'Manage Assessments',
		// 	url: '/districts/manage-assessments',
		// 	description: 'Edit, view, and manage assessment',
		// 	icon: PenTool
		// }
	];
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title class="p-6">Hello,</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<hr class="bg-primary" />
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
