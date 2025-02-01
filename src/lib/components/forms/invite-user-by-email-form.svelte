<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import * as Card from '$lib/components/ui/card';
	import { inviteNewUserSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { page, data, token } = $props();
	const { name, email, inviteId } = decodeInviteToken(token);
	const form = superForm(data.inviteForm, {
		validators: zodClient(inviteNewUserSchema)
	});
	const { form: formData, enhance, message } = form;

	$effect(() => {
		$formData.name = name;
		$formData.email = email;
	});
</script>

<form class="flex flex-col gap-3" method="POST" use:enhance>
	<!-- name -->
	<Form.Field class="hidden space-y-0" {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="sr-only">Admin Name</Form.Label>
				<Input type="hidden" {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- email -->
	<Form.Field class="hidden space-y-0" {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="sr-only">Admin Email</Form.Label>
				<Input type="hidden" {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="m-2 ml-auto w-fit">Send Invite</Form.Button>

	<SuperDebug data={$formData} />
	{#if $message}
		<div class="message text-red-700">{$message}</div>
	{/if}
</form>
