<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LayoutGrid, List, PenTool, UserRoundPlus } from 'lucide-svelte';
	import { users } from '$lib/store/users.svelte';
	const schoolAdminPanelAdminData = [
		// {
		// 	title: 'Create Organization',
		// 	url: '/districts/create',
		// 	description: 'Create organization and send email invitation to administrator.',
		// 	icon: UserRoundPlus
		// },
		{
			title: 'View Schools Dashboard',
			url: '/schools',
			description: 'View completed assessment results for all Schools',
			icon: List
		}
		// {
		// 	title: 'View Results Dashboard',
		// 	url: '/schools/results',
		// 	description: 'View completed assessment results for all schools',
		// 	icon: List
		// }
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
		<Card.Title class="p-6">Hello, {users.selectedUser}</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<hr class="bg-primary" />
	<Card.Content>
		{#each schoolAdminPanelAdminData as item (item.title)}
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
