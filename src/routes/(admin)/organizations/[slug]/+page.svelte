<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();
	const {
		data: { name, phone, email, lastName, members }
	} = data;
</script>

<div class="top flex justify-between">
	<div class="left space-y-3">
		<h1 class="my-6 text-3xl">{name || 'no name?'} | Dashboard</h1>
		<div class="flex gap-3">
			<p>Name:</p>
			<p>{lastName || 'TODO'}</p>
		</div>
		<div class="flex gap-5">
			<div class="flex gap-3">
				<p>Email:</p>
				<p>{email || 'TODO'}</p>
			</div>
			<div class="flex gap-3">
				<p>Phone :</p>
				<p>{phone || 'TODO'}</p>
			</div>
		</div>
		<div class="btns">
			<Button>Add New Member</Button>
			<Button>Bulk Add Members</Button>
		</div>
	</div>
	<div class="right space-y-3">
		<div class="btns">
			<Button>Mass Send Assessments</Button>
			<Button>Copy Assessment Link</Button>
		</div>
		<div class="bars space-y-3">
			<div class="flex grow flex-col">
				<p class=" whitespace-nowrap">Completed</p>
				<Progress value={lastName?.progress || Math.random() * 100} />
			</div>
			<div class="flex grow flex-col">
				<p class=" whitespace-nowrap">In Progress</p>
				<Progress value={lastName?.progress || Math.random() * 100} />
			</div>
			<div class="flex grow flex-col">
				<p class=" whitespace-nowrap">Not Started</p>
				<Progress value={lastName?.progress || Math.random() * 100} />
			</div>
		</div>
		.
	</div>
</div>

<section class="sizes sizes container grid max-w-6xl grid-cols-orgs-fluid gap-4">
	{#each data.members as school (school.name)}
		{@render OrgCard(school)}
	{/each}
</section>

{#snippet OrgCard(school: any)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{school.name}</Card.Title>
			<Card.Description class="flex gap-4 text-primary/50">
				Email:{' '}
				{school.email || 'TODO'}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-wrap items-center gap-3 p-4 ">
			<Button class="md:grow">Send Assessment</Button>
			<div class="flex grow flex-col gap-2">
				<div class="flex justify-between md:grow">
					<p class=" whitespace-nowrap">Assessment Progress</p>
					<p class=" whitespace-nowrap">
						{school?.progress || Math.floor(Math.random() * 100)}
					</p>
				</div>
				<Progress barBgColor={'bg-green-700'} value={school?.progress || Math.random() * 100} />
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
