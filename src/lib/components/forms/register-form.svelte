<script lang="ts">
	import { dev } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createNewUserFromInviteSchema } from '$lib/schema.js';
	import { decodeAdminUserInviteToken } from '$lib/utils';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, token } = $props();
	const { name, email, inviteId } = decodeAdminUserInviteToken(token);

	const form = superForm(data.form, {
		validators: zodClient(createNewUserFromInviteSchema)
	});
	const { form: formData, enhance, message } = form;
	$effect(() => {
		$formData.name = name;
		$formData.email = email;
		$formData.inviteId = inviteId;
	});
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title>Account Access</Card.Title>
		<Card.Description>Hello, {name ? name : 'TODO'} register to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" action="?/register" method="POST" use:enhance>
			<Field {form} name="name">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							type="hidden"
							name="name"
							class="hidden"
							bind:value={$formData.name}
						/>
					{/snippet}
				</Control>
			</Field>

			<!-- username -->
			<Field {form} name="email">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							type="hidden"
							name="email"
							hidden
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Control>
			</Field>

			<!-- username -->
			<Field {form} name="inviteId">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							type="hidden"
							name="inviteId"
							hidden
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							bind:value={$formData.inviteId}
						/>
					{/snippet}
				</Control>
			</Field>

			<!-- password -->
			<Field {form} name="password">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Password</Label>
						<input
							{...props}
							type="password"
							name="password"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter  Password"
							bind:value={$formData.password}
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>

			<!-- confirm -->
			<Field {form} name="confirm">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Confirm Password</Label>
						<input
							{...props}
							type="password"
							name="confirm"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Confirm Password"
							bind:value={$formData.confirm}
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>
			<div class="flex gap-4">
				<Button class="grow" type="submit" variant="default">Register</Button>
			</div>
		</form>
	</Card.Content>
	{#if $message}
		<div class="message text-red-700">{$message}</div>
	{/if}
	{#if dev}
		<SuperDebug data={$formData} />
	{/if}
</Card.Root>
