<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import {
		LayoutGrid,
		List,
		PenTool,
		Slice,
		UserRoundPlus,
		NotepadTextDashed
	} from 'lucide-svelte';

	const adminData = [
		{
			title: 'Create School',
			url: '/schools/create-school',
			description: 'Create school and send email invitation to administrator.',
			icon: UserRoundPlus
		},
		{
			title: 'Manage Districts',
			url: '/districts',
			description: 'View the details for all districts',
			icon: LayoutGrid
		},
		{
			title: 'Manage Schools',
			url: '/schools',
			description: 'Manage the details for all schools',
			icon: LayoutGrid
		},
		{
			title: 'View Results Dashboard',
			url: '/results',
			description: 'View completed assessment results for all schools',
			icon: List
		},
		{
			title: 'Edit HTML Email Template text',
			url: '/templates',
			description: 'Edit the text for the email template',
			icon: NotepadTextDashed
		}
		// {
		// 	title: 'Manage Assessments',
		// 	url: '/schools',/manage-assessments',
		// 	description: 'Edit, view, and manage assessment',
		// 	icon: PenTool
		// }
	];

	let { displayName } = $props();
</script>

<Card.Root class="mx-auto max-w-6xl shadow-lg">
	<Card.Header>
		<Card.Title class="p-6">Hello, {displayName ? displayName : 'TODO'}</Card.Title>
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
			<item.icon />
			<div class="space-y-2">
				<p>{item.title}</p>
				<p class="text-primary/50">{item.description}</p>
			</div>
		</a>
	</Card.Content>
{/snippet}
