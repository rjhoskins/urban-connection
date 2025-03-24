<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Pencil, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Card from '$lib/components/ui/card';
	import { schoolAdminUserInviteHTMLEmailTemplateSchema } from '$lib/schema.js';
	import { defaults, superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import HtmlEmailTextPreview from '../html-email-text-preview.svelte';
	import { dev } from '$app/environment';
	import type { ActionResult } from '@sveltejs/kit';
	import { deserialize } from '$app/forms';
	import toast from 'svelte-french-toast';

	let { formisEditing = $bindable(), data } = $props();

	const thisForm = superForm(
		defaults(data.form.data || {}, zodClient(schoolAdminUserInviteHTMLEmailTemplateSchema)),
		{
			SPA: true,
			dataType: 'json',
			resetForm: false,
			clearOnSubmit: 'errors-and-message',
			validators: zodClient(schoolAdminUserInviteHTMLEmailTemplateSchema),
			onSubmit: async ({ action }) => {
				const results = schoolAdminUserInviteHTMLEmailTemplateSchema.safeParse($form);

				if (!results.success) {
					console.log('results.error ===>', results.error);
					toast.error('Form has errors');
					return;
				}
				const htmlTemplateFormData = new FormData();
				for (const [key, value] of Object.entries($form)) {
					if (Array.isArray(value)) {
						// For arrays, append each item with the same key
						for (const item of value) {
							htmlTemplateFormData.append(key, item);
						}
					} else {
						htmlTemplateFormData.append(key, String(value));
					}
				}
				console.log('htmlTemplateFormData ===>', htmlTemplateFormData);
				const response = await fetch(action, {
					method: 'POST',
					body: htmlTemplateFormData,
					headers: {
						'x-sveltekit-action': 'true'
					}
				});
				const result: ActionResult = deserialize(await response.text());
				console.log('handleSubmit result ===>', result);
			},
			onUpdate: async ({ form }) => {
				// if (!form.valid) return;
				// console.log('onUpdate form.data ===>', form.data);
			}
		}
	);
	const { form, errors, enhance, message, tainted, isTainted } = thisForm;

	let newKeyPoint = $state('');

	form.update(
		($form) => {
			return $form;
		},
		{ taint: 'untaint-form' }
	);
</script>

<div class="relative flex w-full">
	<Button
		class="absolute top-2 right-2 ml-auto"
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
		<form class=" min-w-prose flex flex-col gap-3" method="POST" use:enhance>
			<input type="hidden" name="type" value={data.type} />
			<!-- greeting -->
			<Form.Field class="space-y-1" name="greeting" form={thisForm}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Greeting</Form.Label>
						<Input type="text" bind:value={$form.greeting} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- definition -->
			<Form.Field class=" space-y-1" name="definition" form={thisForm}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Definition</Form.Label>
						<Textarea {...props} bind:value={$form.definition} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- keyPoints -->

			<ul class="flex flex-col gap-1.5">
				{#each $form.keyPoints as keyPoint (keyPoint)}
					<li class="flex items-center gap-x-4 p-1">
						{keyPoint}
						<Button
							class=""
							onclick={() =>
								($form.keyPoints = $form.keyPoints.filter((el: any) => el !== keyPoint))}
							size="icon"
							variant="outline"><X /></Button
						>
					</li>
				{/each}
			</ul>

			<!-- keyPoints -->

			<Form.Field class=" space-y-1" form={thisForm} name="keyPoints">
				<input type="hidden" name="keyPoints" value={$form.keyPoints} />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field class=" space-y-1" form={thisForm} name="newKeyPoint">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">KeyPoints</Form.Label>
						<div class="flex gap-4 py-2">
							<Input
								type="text"
								{...props}
								onkeyup={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										console.log('Enter key pressed');
										$form.keyPoints = [...$form.keyPoints, newKeyPoint];
										newKeyPoint = '';
										return false;
									}
								}}
								bind:value={newKeyPoint}
							/>
							<Button
								onclick={() => {
									$form.keyPoints = [...$form.keyPoints, newKeyPoint];
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
						<Input type="text" {...props} bind:value={$form.closing} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<!-- closing -->
			<Form.Field class=" space-y-1" form={thisForm} name="callToAction">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Call To Action</Form.Label>
						<Input type="text" {...props} bind:value={$form.callToAction} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- registrationLink -->
			<Form.Field class="space-y-1" form={thisForm} name="registrationLinkText">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="">Registration Link Text</Form.Label>
						<Input type="text" {...props} bind:value={$form.registrationLinkText} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit" disabled={!$tainted}>Save Email Changes</Form.Button>

			<!-- {#if $tainted}
				<div class="message text-red-700">Form has changed</div>
			{/if} -->
			<div class="max-w-prose">
				{#if dev}
					<SuperDebug data={$form} />
				{/if}
			</div>
		</form>

		<!-- END editor -->
	</Card.Content>
{:else}
	<HtmlEmailTextPreview data={$form} disableLink />
{/if}

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
