<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import * as Card from '$lib/components/ui/card';
	import { sendAssessmentInviteSchem } from '$lib/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { LoaderCircle } from 'lucide-svelte';

	let { inviteText = $bindable(), data } = $props();
	const form = superForm(data.form, {
		validators: zodClient(sendAssessmentInviteSchem)
	});
	const { form: formData, enhance, message, delayed } = form;

	// inviteText = $formData.inviteText;
</script>

<Card.Root class="">
	<Card.Header>
		<Card.Title>Send Assessment</Card.Title>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<!-- name -->
			<Form.Field class=" space-y-0" {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Teacher Name</Form.Label>
						<Input type="" {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- email -->
			<Form.Field class=" space-y-0" {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Teacher Email</Form.Label>
						<Input type="" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
					Sending...
				{:else}
					Send Invite
				{/if}</Form.Button
			>

			{#if dev}
				<SuperDebug data={$formData} />
			{/if}
			{#if $message}
				<div class="message text-red-700">{$message}</div>
			{/if}
		</form>
	</Card.Content>
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</Card.Root>
