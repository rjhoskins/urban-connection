<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import type { ActionResult } from '@sveltejs/kit';
	import { LoaderCircle, CircleCheck } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dev } from '$app/environment';
	import { applyAction, deserialize } from '$app/forms';
	import toast from 'svelte-french-toast';
	import * as Dialog from '../ui/dialog';
	import { Button } from '../ui/button';
	import { goto, invalidateAll } from '$app/navigation';
	import { inviteNewAdminOrCoAdminUserSchema } from '$lib/schema';

	let { page, data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(inviteNewAdminOrCoAdminUserSchema),
		onSubmit: () => {
			console.log('onSubmit');
		},
		onResult: async ({ result, cancel }) => {
			console.log('onResult', result);
			if (result.type === 'success') {
				isModalOpen = true;
				await invalidateAll();
				cancel();
			} else {
				cancel();
				toast.error('Error sending invite');
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;

	let isModalOpen = $state(false);

	$effect(() => {
		console.log('delayed ===>', $delayed);
	});

	function handleLeave() {
		isModalOpen = false;
		goto('./');
	}
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

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="w-fit">
		<Dialog.Header>
			<Dialog.Title class=" text-primary flex items-center gap-2 p-1 text-xl">
				<CircleCheck class="text-primary h-5 w-5" /><span class="block">Success!</span
				></Dialog.Title
			>
			<Dialog.Description class="font text-[#4B5563]"
				>Admin has been invited to register</Dialog.Description
			>
		</Dialog.Header>
		<div class="flex gap-4 font-normal">
			<Button
				variant="secondary"
				onclick={() => (isModalOpen = !isModalOpen)}
				class="w-full !font-normal">Stay On Page</Button
			>
			<Button onclick={handleLeave} class="w-full !font-normal">Manage Organization</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
