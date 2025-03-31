<script lang="ts">
	import { dev } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createNewUserOrLoginSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createNewUserOrLoginSchema)
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<Card.Root class="mx-12  w-[320px] max-w-6xl p-9 md:w-[375px] xl:w-[420px]">
	<img
		class=" mb-4 aspect-square w-20"
		alt="city with school"
		src="/img/urban-connection-logo.png"
	/>
	<h2 class="mb-12 text-[2rem] text-[#2C205A]">Welcome to Urban Connection Project</h2>
	<form class=" flex flex-col gap-3 text-[#030229]" action="?/login" method="POST" use:enhance>
		<!-- username -->
		<Field {form} name="username">
			<Control>
				{#snippet children({ props }: { props: any })}
					<Label>Email Address</Label>
					<input
						{...props}
						type="text"
						name="username"
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
						name="password"
						type="password"
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						placeholder="Enter  Password"
						bind:value={$formData.password}
					/>
				{/snippet}
			</Control>
			<FieldErrors class="text-red-700" />
		</Field>

		<div class="mb-10 flex items-center justify-between">
			<!-- remember -->
			<Field {form} name="remember">
				<Control>
					{#snippet children({ props })}
						<div class=" space-y-1 leading-none">
							<Checkbox class="" {...props} bind:checked={$formData.remember} />
							<Label class=" ml-2.5">Remember me</Label>
							<!-- <Description>
							You can manage your remember notifications in the <a href="/examples/forms"
								>remember settings</a
							> page.
						</Description> -->
						</div>
						<input class="" name={props.name} value={$formData.remember} hidden />
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>

			<a class="text-[#371E98]" href="/">Reset Password</a>
		</div>
		<div class="flex gap-4">
			<Button class="grow" type="submit" variant="default">
				{#if $delayed}
					<LoaderCircle class="animate-spin" />
					Logging In...
				{:else}
					Log In
				{/if}
			</Button>
		</div>
		{#if dev}
			<SuperDebug data={$formData} />
		{/if}
	</form>
</Card.Root>
