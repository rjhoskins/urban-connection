<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import * as Card from '$lib/components/ui/card';
	import { inviteNewAdminUserSchema } from '$lib/schema.js';
	// import { decodeAdminUserInviteToken } from '$lib/utils';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { LoaderCircle } from 'lucide-svelte';
	import HtmlEmailTextPreview from '../html-email-text-preview.svelte';
	import { onMount } from 'svelte';

	let { page, data, unusedAdminUserInvite, canEditForm } = $props();
	const { name, email, adminInviteId } = unusedAdminUserInvite;
	const form = superForm(data.inviteForm, {
		dataType: 'json',
		validators: zodClient(inviteNewAdminUserSchema)
	});
	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		$formData.name = name;
		$formData.email = email;
		$formData.adminInviteId = adminInviteId;
	});
</script>

{#if !canEditForm}
	<HtmlEmailTextPreview
		data={data.emailForm.data}
		{unusedAdminUserInvite}
		disableLink={!canEditForm}
	/>
{/if}

<form class="flex flex-col gap-3" method="POST" action="?/invite" use:enhance>
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
	<!-- publicId -->
	<Form.Field class="hidden space-y-0" {form} name="adminInviteId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="sr-only">Admin InviteId</Form.Label>
				<Input type="hidden" {...props} bind:value={$formData.adminInviteId} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button type="submit" class="m-2 ml-auto w-fit">
		{#if $delayed}
			<LoaderCircle class="animate-spin" />
			Sending...
		{:else}
			Send Invitez
		{/if}</Form.Button
	>

	{#if dev}
		<SuperDebug data={$formData} />
	{/if}
	{#if $message}
		<div class="message text-red-700">{$message}</div>
	{/if}
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</form>
