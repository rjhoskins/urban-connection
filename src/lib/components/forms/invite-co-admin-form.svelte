<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import { inviteNewUserSchema } from '$lib/schema.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';

	let { page, data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(inviteNewUserSchema)
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<Card.Root class="w-96 max-w-6xl">
	<Card.Header>
		<Card.Title class="p-6">Invite a Co-Admin</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<hr class="bg-primary" />
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<!-- name -->
			<Form.Field class=" space-y-0" {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Co-Admin Name</Form.Label>
						<Input type="" {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="my-1" />
			</Form.Field>

			<!-- email -->
			<Form.Field class=" space-y-0" {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Co-Admin Email</Form.Label>
						<Input type="" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="my-1" />
			</Form.Field>
			<!-- email -->
			<Form.Field class=" space-y-0" {form} name="phone">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Co-Admin Phone</Form.Label>
						<Input type="" {...props} bind:value={$formData.phone} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit" class="m-2">
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
					Sending...
				{:else}
					Send Invite
				{/if}
			</Form.Button>

			{#if dev}
				<SuperDebug data={$formData} />
			{/if}
		</form>
	</Card.Content>
</Card.Root>
