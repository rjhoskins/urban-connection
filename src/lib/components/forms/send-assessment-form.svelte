<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import * as Card from '$lib/components/ui/card';
	import { inviteNewUserSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { inviteText = $bindable(), data, token } = $props();
	// const { name, email, inviteId } = decodeInviteToken(token);
	const form = superForm(data.form, {
		validators: zodClient(inviteNewUserSchema)
	});
	const { form: formData, enhance, message } = form;

	$effect(() => {
		// $formData.name = name;
		// $formData.email = email;
	});
	inviteText = $formData.inviteText;
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

			<!-- email -->
			<Form.Field class="" {form} name="inviteText">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Custom Message</Form.Label>
						<Textarea
							onkeyup={(e) => {
								inviteText = (e.target as HTMLTextAreaElement).value;
							}}
							{...props}
							placeholder="Enter invite text"
							class="resize-none"
							bind:value={$formData.inviteText}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>Send Invite</Form.Button>

			<SuperDebug data={$formData} />
			{#if $message}
				<div class="message text-red-700">{$message}</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>
