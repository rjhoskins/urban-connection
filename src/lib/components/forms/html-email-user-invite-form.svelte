<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Pencil, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Card from '$lib/components/ui/card';
	import { userInviteHTMLEmailTemplateSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import HtmlEmailTextPreview from '../html-email-text-preview.svelte';

	let { formisEditing = $bindable(), data, token, page, initialTemplateData } = $props();

	const thisForm = superForm(data.emailForm, {
		dataType: 'json',
		validators: zodClient(userInviteHTMLEmailTemplateSchema),
		invalidateAll: false,
		onSubmit: async ({ formData, cancel }) => {
			console.log('formData', formData);
		}
	});
	const {
		form: emailForm,
		errors: emailErrors,
		enhance: emailEnhance,
		message: emailMessage,
		tainted: emailTainted,
		isTainted: isTaintedEmail
	} = thisForm;

	let newKeyPoint = $state('');
</script>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<div class="relative flex w-full">
	<Button
		class="absolute right-2 top-2 ml-auto"
		size="icon"
		variant="outline"
		onclick={() => (formisEditing = !formisEditing)}
	>
		{#if formisEditing}
			<X />
		{:else}
			<Pencil />
		{/if}
	</Button>
</div>
{#if formisEditing}
	<!-- START editor -->
	<Card.Header class="pb-5">
		<Card.Title>Edit Administrator Text</Card.Title>
	</Card.Header>
	<Card.Content>
		<form class=" min-w-prose flex flex-col gap-3" method="POST" action="?/email" use:emailEnhance>
			<!-- greeting -->
			<Form.Field class="space-y-1" name="greeting" form={thisForm}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Greeting</Form.Label>
						<Input type="text" {...props} bind:value={$emailForm.greeting} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- definition -->
			<Form.Field class=" space-y-1" name="definition" form={thisForm}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Definition</Form.Label>
						<Textarea {...props} bind:value={$emailForm.definition} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<ul class="flex flex-col gap-1.5">
				{#each $emailForm.keyPoints as keyPoint (keyPoint)}
					<li class="flex items-center gap-x-4 p-1">
						{keyPoint}
						<Button
							class=" "
							onclick={() =>
								($emailForm.keyPoints = $emailForm.keyPoints.filter((el: any) => el !== keyPoint))}
							size="icon"
							variant="outline"><X /></Button
						>
					</li>
				{/each}
			</ul>

			<!-- keyPoints -->

			<Form.Field class=" space-y-1" form={thisForm} name="keyPoints[]">
				<input type="hidden" name="keyPoints[]" value={$emailForm.keyPoints} />

				<Form.FieldErrors />
			</Form.Field>
			<Form.Field class=" space-y-1" form={thisForm} name="newKeyPoint">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">KeyPoints</Form.Label>
						<div class="flex gap-4 py-2">
							<Input type="text" {...props} bind:value={newKeyPoint} />
							<Button
								onclick={() => {
									$emailForm.keyPoints = [...$emailForm.keyPoints, newKeyPoint];
									newKeyPoint = '';
								}}>Add</Button
							>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- closing -->
			<Form.Field class=" space-y-1" form={thisForm} name="closing">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Closing</Form.Label>
						<Input type="text" {...props} bind:value={$emailForm.closing} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<!-- closing -->
			<Form.Field class=" space-y-1" form={thisForm} name="callToAction">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Call To Action</Form.Label>
						<Input type="text" {...props} bind:value={$emailForm.callToAction} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- registrationLink -->
			<Form.Field class="space-y-1" form={thisForm} name="registrationLinkText">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Registration Link Text</Form.Label>
						<Input type="text" {...props} bind:value={$emailForm.registrationLinkText} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit" disabled={!$emailTainted}>Save Email Changes</Form.Button>

			<!-- {#if $emailTainted}
				<div class="message text-red-700">Form has changed</div>
			{/if} -->
			<!-- <SuperDebug data={$emailForm} /> -->
		</form>

		<!-- END editor -->
	</Card.Content>
{:else}
	<HtmlEmailTextPreview data={$emailForm} {page} {token} />
{/if}
