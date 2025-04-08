<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { templateTypes } = data;

	const templateTypeAugmentedData = [
		{
			type: 'admin_invite',
			title: 'School & District Admin Invite',
			usedIn: [
				'Invite School Admin',
				'School Admin inviting co-School Admin',
				'Invite District Admin'
			]
		},
		{
			type: 'assessment_invite',
			title: 'Send Assessment Invite',
			usedIn: ['all assessment invites']
		}
	];
	const combinedData = templateTypeAugmentedData.map((template) => {
		const templateType = templateTypes?.find((type) => type.type === template.type);
		return {
			...template,
			...templateType
		};
	});
</script>

<section class="">
	<h1 class="my-6 text-center text-4xl">HTML Email Templates</h1>
	<div class="grid-cols-four-fluid mx-auto grid max-w-7xl gap-4 p-2">
		{#each combinedData as template, idx (`template.title-${idx}`)}
			{@render templateCard(template)}
		{/each}
	</div>
</section>

<!-- <pre>{JSON.stringify(combinedData, null, 2)}</pre> -->

{#snippet templateCard(template: any)}
	<Card.Root class="flex flex-col transition-shadow duration-300 hover:shadow-lg">
		<Card.Header>
			<Card.Title>{template.title}</Card.Title>
			<Card.Description class="">
				Used in {template.usedIn.length}
				{#if template.usedIn.length > 1}
					places
				{:else}
					place
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex grow flex-col gap-2 p-4">
			<p class="text-bold">Used In</p>
			<ul class="mb-auto">
				{#each template.usedIn as location, idx (`${idx}-${location}`)}
					<li class=" list-inside list-disc">{location}</li>
				{/each}
			</ul>
			<Button href={`${page.url.pathname}/${template.type}`}>Edit Template Content</Button>
		</Card.Content>
	</Card.Root>
{/snippet}
