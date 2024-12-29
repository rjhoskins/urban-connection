<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createOrganizationSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const form = superForm(data, {
		validators: zodClient(createOrganizationSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title class="text-center">Account Access</Card.Title>
		<Card.Description
			>Login or create a new account to complete a survey or access your dashboard
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<Field {form} name="name">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Username</Label>
						<input
							{...props}
							type="text"
							name="username"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter your Username"
							bind:value={$formData.username}
						/>
					{/snippet}
				</Control>
				<!-- <Description class="-mt-2 text-sm text-primary/50"
					>This is the name the Organization name</Description
				> -->
				<FieldErrors class="text-red-700" />
			</Field>
			<Field {form} name="password">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>Password</Label>
						<input
							{...props}
							type="password"
							name="password"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter your password"
							required
							bind:value={$formData.password}
						/>
					{/snippet}
				</Control>
				<!-- <Description class="-mt-2 text-sm text-primary/50"
					>This is the name the Organization name</Description
				> -->
				<FieldErrors class="text-red-700" />
			</Field>
			<div class="flex gap-4">
				<button
					type="submit"
					class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Login
				</button>
				<button
					type="button"
					formaction="?/register"
					class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>Register</button
				>
			</div>

			{#if $message}
				<div class="message text-green-700">{$message}</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>

<Card.Root class="container mx-auto mt-20 max-w-4xl p-4">
	<SuperDebug data={$formData} />

	<pre>{JSON.stringify(data, null, 2)}</pre>
	<pre class="sizes">{JSON.stringify($formData, null, 2)}</pre>
</Card.Root>
