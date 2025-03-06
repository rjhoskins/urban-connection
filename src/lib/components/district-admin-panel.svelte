<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LayoutGrid, List, PenTool, Send, UserRoundPlus, Eye } from 'lucide-svelte';

	const adminData = [
		{
			title: 'View  Organization',
			url: '/districts',
			description: 'View dashboard and manage district.',
			icon: Eye
		},
		{
			title: 'Send Assessment Invitation',
			url: '/districts',
			description: 'Navigate to a school to add an additional administrator.',
			icon: Send
		},
		{
			title: 'Invite School Admin Invitation',
			url: '/districts',
			description: 'Navigate to a school to send an assessment to a teacher.',
			icon: UserRoundPlus
		},
		{
			title: 'View Assessment Results',
			url: '/districts?&view=results',
			description: 'View assessment results for the your district.',
			icon: List
		}
	];

	let { displayName, district } = $props();
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<p class="text-primary/50 -mb-2">Manage District</p>
		<Card.Title class="mt-0! py-4">{district.name}</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<hr class="bg-primary" />

	{#each adminData.slice(0, 3) as item (item.title)}
		{@render dashItem(item)}
	{/each}

	<hr class="bg-primary" />

	{#each adminData.slice(3, adminData.length) as item (item.title)}
		{@render dashItem(item)}
	{/each}
</Card.Root>

{#snippet dashItem(item: any)}
	<Card.Content>
		<a href={item.url} class="flex gap-3">
			<item.icon />
			<div class="space-y-2">
				<p>{item.title}</p>
				<p class="text-primary/50">{item.description}</p>
			</div>
		</a>
	</Card.Content>
{/snippet}
