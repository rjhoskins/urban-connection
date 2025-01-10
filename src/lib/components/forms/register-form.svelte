<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { registerNewUserSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, token } = $props();
	const { name, email } = decodeInviteToken(token);

	const form = superForm(data.form, {
		validators: zodClient(registerNewUserSchema)
	});
	const { form: formData, enhance, message } = form;
	$effect(() => {
		$formData.email = email;
	});
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title>Account Access</Card.Title>
		<Card.Description>Hello, {name ? name : 'TODO'} register to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" action="?/register" method="POST" use:enhance>
			<Field {form} name="email">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							type="hidden"
							name="email"
							class="hidden"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Control>
			</Field>

			<!-- username -->
			<Field {form} name="username">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Username</Label>
						<input
							{...props}
							type="text"
							name="username"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter Username"
							bind:value={$formData.username}
						/>
					{/snippet}
				</Control>
				<Description>This is your unique case-sensitive public display name.</Description>
				<FieldErrors class="text-red-700" />
			</Field>

			<!-- password -->
			<Field {form} name="password">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Password</Label>
						<input
							{...props}
							type="text"
							name="password"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
							type="text"
							name="confirm"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Confirm Password"
							bind:value={$formData.confirm}
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>
			<div class="flex gap-4">
				<Button class="grow" type="submit" variant="default">Submit</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>

<Card.Root class="container mx-auto mt-20 max-w-4xl p-4">
	<SuperDebug data={$formData} />
</Card.Root>
