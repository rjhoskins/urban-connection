<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { List, UserRoundPlus, Eye, Send } from 'lucide-svelte';
	const schoolAdminPanelAdminData = [
		{
			title: 'View Organization',
			url: '/schools',
			description: 'View  organization & results by teacher.',
			icon: Eye
		},
		{
			title: 'Invite Administrator',
			url: '/schools?&view=invite',
			description: 'Send email invitation to administrator.',
			icon: UserRoundPlus
		},
		{
			title: 'Send Assessment Invitation',
			url: '/schools/?&view=assessment',
			description: 'Send email invitation to take the Assessment.',
			icon: Send
		},
		{
			title: 'View Assessment Results',
			url: '/schools?&view=results',
			description: 'View completed Assessment Total results for the organization',
			icon: List
		}
	];

	let { displayName, school } = $props();
</script>

<Card.Root class="mx-auto max-w-6xl shadow-2xl">
	<Card.Header>
		<p class="text-primary/50 -mb-2">Manage School</p>
		<Card.Title class="mt-0! py-4">{school.name}</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<hr class="bg-primary" />

	{#each schoolAdminPanelAdminData.slice(0, 3) as item (item.title)}
		{@render dashItem(item)}
	{/each}
	<hr class="bg-primary" />
	{#each schoolAdminPanelAdminData.slice(3, schoolAdminPanelAdminData.length) as item (item.title)}
		{@render dashItem(item)}
	{/each}
</Card.Root>

{#snippet dashItem(item: any)}
	<Card.Content>
		<a href={item.url} class="flex gap-3">
			<!-- svelte-ignore svelte_component_deprecated -->
			<item.icon />
			<div class="space-y-2">
				<p>{item.title}</p>
				<p class="text-primary/50">{item.description}</p>
			</div>
		</a>
	</Card.Content>
{/snippet}
