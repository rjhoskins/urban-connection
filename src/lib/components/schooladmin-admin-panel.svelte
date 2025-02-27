<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { List, UserRoundPlus, Eye, Send } from 'lucide-svelte';
	const schoolAdminPanelAdminData = [
		{
			title: 'Invite Administrator',
			url: '/schools/invite-coadmin',
			description: 'Send email invitation to administrator.',
			icon: UserRoundPlus
		},
		{
			title: 'View Organization',
			url: '/schools',
			description: 'View Teachers of the organization..',
			icon: Eye
		},
		{
			title: 'Invite Participants',
			url: '/schools/invite',
			description: 'Send email invitations to Assessment participants',
			icon: Send
		},
		{
			title: 'View Assessment Results',
			url: '/schools/assessments',
			description: 'View completed Assessment results for the organization',
			icon: List
		}
	];

	let { displayName, school } = $props();
</script>

<Card.Root class="mx-auto max-w-6xl shadow-2xl">
	<Card.Header>
		<p class="-mb-2 text-primary/50">Manage School</p>
		<Card.Title class="!mt-0 py-4">{school.name}</Card.Title>
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
			<svelte:component this={item.icon} />
			<div class="space-y-2">
				<p>{item.title}</p>
				<p class="text-primary/50">{item.description}</p>
			</div>
		</a>
	</Card.Content>
{/snippet}
