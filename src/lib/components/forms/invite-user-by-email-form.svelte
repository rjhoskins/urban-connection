<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Pencil, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import * as Card from '$lib/components/ui/card';
	import { inviteNewUserSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	const initialData = {
		greeting: 'Dear Administrator,',
		definition:
			'The Urban Connection Project defines Cultural Responsiveness as the bridge between people built by the infusion of cultural experiences necessary to:',
		keyPoints: [
			'implement systems of accountability',
			'cultivate necessary relationships',
			'ensure content acquisition (education)'
		],
		closing: 'We are happy to partner with you!',
		callToAction: 'Please register to access your organization',
		registrationLink: {
			text: 'here',
			url: ''
		}
	};

	let { inviteText = $bindable(), data, token, page } = $props();
	const { name, email } = decodeInviteToken(token);
	const form = superForm(data.form, {
		validators: zodClient(inviteNewUserSchema)
	});
	const { form: formData, enhance, message, isTainted } = form;
	let isEditing = $state(true);
	let newKeyPoint = $state('');

	formData.update(
		($formData) => {
			$formData.name = name;
			$formData.email = email;
			// /auth/register?inviteToken=TXIgYm9ifG1yYm9iQGV4YW1wbGUuY29t
			$formData.emailTemplateData = initialData;
			$formData.emailTemplateData.registrationLink.url = `${page.url}/auth/register?inviteToken=${token}`;
			return $formData;
		},
		{ taint: false }
	);
	formData.update(
		($formData) => {
			$formData = $formData;
			return $formData;
		},
		{ taint: true }
	);
</script>

<Card.Root class="max-w-2xl">
	<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
	<div class="flex w-full">
		<Button
			class="m-2 ml-auto"
			size="icon"
			variant="outline"
			onclick={() => (isEditing = !isEditing)}
		>
			{#if isEditing}
				<X />
			{:else}
				<Pencil />
			{/if}
		</Button>
	</div>
	{#if isEditing}
		<!-- START editor -->
		<Card.Header>
			<Card.Title>Edit Administrator Text</Card.Title>
		</Card.Header>
		<Card.Content>
			<form class="flex flex-col gap-3" method="POST" use:enhance>
				<!-- name -->
				<Form.Field class="hidden space-y-1" {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="sr-only">Admin Name</Form.Label>
							<Input type="hidden" {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- email -->
				<Form.Field class="hidden space-y-1" {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="sr-only">Admin Email</Form.Label>
							<Input type="hidden" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- emailTemplateData[greeting] -->
				<Form.Field class=" space-y-1" {form} name="emailTemplateData[greeting]">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="">Greeting</Form.Label>
							<Input type="text" {...props} bind:value={$formData.emailTemplateData.greeting} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- emailTemplateData[definition] -->
				<Form.Field class=" space-y-1" {form} name="emailTemplateData[definition]">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="">Definition</Form.Label>
							<Textarea {...props} bind:value={$formData.emailTemplateData.definition} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<ul class="flex flex-col gap-1.5">
					{#each $formData.emailTemplateData.keyPoints as keyPoint (keyPoint)}
						<li class="flex items-center gap-x-4 p-1">
							{keyPoint}
							<Button
								class=" "
								onclick={() =>
									($formData.emailTemplateData.keyPoints =
										$formData.emailTemplateData.keyPoints.filter((el) => el !== keyPoint))}
								size="icon"
								variant="outline"><X /></Button
							>
						</li>
					{/each}
				</ul>

				<!-- emailTemplateData[keyPoints] -->
				<Form.Field class=" space-y-1" {form} name="emailTemplateData[keyPoints]">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="">KeyPoints</Form.Label>
							<div class="flex gap-4 py-2">
								<Input type="text" {...props} bind:value={newKeyPoint} />
								<Button
									onclick={() => {
										$formData.emailTemplateData.keyPoints = [
											...$formData.emailTemplateData.keyPoints,
											newKeyPoint
										];

										newKeyPoint = '';
									}}>Add</Button
								>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- emailTemplateData[closing] -->
				<Form.Field class=" space-y-1" {form} name="emailTemplateData[closing]">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="">Closing</Form.Label>
							<Input type="text" {...props} bind:value={$formData.emailTemplateData.closing} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- emailTemplateData[registrationLink] -->
				<Form.Field class="space-y-1" {form} name="emailTemplateData[registrationLink].text">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="">Registration Link Text</Form.Label>
							<Input
								type="text"
								{...props}
								bind:value={$formData.emailTemplateData.registrationLink.text}
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
				{#if isTainted()}
					<div class="message text-red-700">Form is dirty</div>
				{/if}
			</form>
		</Card.Content>
		<!-- END editor -->
	{:else}
		<!-- START html -->
		<Card.Header class="Header">
			<Card.Title>Invite Administrator Text</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-3">
			<p>{$formData.emailTemplateData.greeting}</p>
			<p>
				{$formData.emailTemplateData.definition}
			</p>
			<ul class="list-inside list-disc">
				{#each $formData.emailTemplateData.keyPoints as keyPoint (keyPoint)}
					<li>{keyPoint}</li>
				{/each}
			</ul>

			<p>
				{$formData.emailTemplateData.callToAction}
				<a
					href={$formData.emailTemplateData.registrationLink.url}
					class=" text-lg text-blue-700 underline"
					>{$formData.emailTemplateData.registrationLink.text}</a
				>
			</p>
		</Card.Content>
		<!-- END html -->
	{/if}
</Card.Root>
