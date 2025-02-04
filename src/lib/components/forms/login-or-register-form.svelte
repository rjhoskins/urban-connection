<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createNewUserOrLoginSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createNewUserOrLoginSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<Card.Root class="mx-auto min-w-96 max-w-6xl">
	<Card.Header>
		<Card.Title>Account Access</Card.Title>
		<Card.Description>Log In or Sign Up</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" action="?/login" method="POST" use:enhance>
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
				<Description>Should be your email address</Description>
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
			<div class="flex gap-4">
				<Button class="grow" type="submit" variant="default">Login</Button>
				<Button class="grow" type="submit" formaction="?/register" variant="outline"
					>Register</Button
				>
			</div>
			<SuperDebug data={$formData} />
		</form>
	</Card.Content>
</Card.Root>
