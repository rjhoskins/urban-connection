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
	import Input from '../ui/input/input.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';

	let { data } = $props();
	let passWordIsVisible = $state(false);

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
	<h2 class="mb-12 text-[2rem] text-[#2C205A]">
		Climate Effectiveness Progress Monitoring Assessment
	</h2>
	<form class=" flex flex-col gap-3" action="?/login" method="POST" use:enhance>
		<!-- username -->
		<Field {form} name="username">
			<Control>
				{#snippet children({ props }: { props: any })}
					<Label>Email Address</Label>
					<Input
						{...props}
						type="text"
						name="username"
						placeholder="Enter Email Address"
						bind:value={$formData.username}
					/>
				{/snippet}
			</Control>

			<FieldErrors class="text-red-700" />
		</Field>

		<!-- password -->
		<Field {form} name="password">
			<Control>
				{#snippet children({ props }: { props: any })}
					<Label>Password</Label>
					<div class=" relative">
						<Input
							{...props}
							name="password"
							type={passWordIsVisible ? 'text' : 'password'}
							class="relative"
							placeholder="Enter  Password"
							bind:value={$formData.password}
						/>
						<div class="absolute top-1/2 right-3 z-10 -translate-y-1/2 transform cursor-pointer">
							{#if passWordIsVisible}
								<Eye
									class="absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 transform cursor-pointer text-[#230B34]"
									onclick={() => (passWordIsVisible = !passWordIsVisible)}
								/>
							{:else}
								<EyeOff
									class="absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 transform cursor-pointer text-[#230B34]"
									onclick={() => (passWordIsVisible = !passWordIsVisible)}
								/>
							{/if}
						</div>
					</div>
				{/snippet}
			</Control>
			<FieldErrors class="text-red-700" />
		</Field>

		<div class=" flex items-center justify-between">
			<!-- remember -->
			<!-- <Field {form} name="remember">
				<Control>
					{#snippet children({ props })}
						<div class=" space-y-1 leading-none">
							<Checkbox class="" {...props} bind:checked={$formData.remember} />
							<Label class=" ml-2.5">Remember me</Label>
						<Description>
							You can manage your remember notifications in the <a href="/examples/forms"
								>remember settings</a
							> page.
						</Description> 
						</div>
						<input class="" name={props.name} value={$formData.remember} hidden />
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field> -->

			<!-- <a class="text-[#371E98]" href="/">Reset Password</a> -->
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
			<!-- <SuperDebug data={$formData} /> -->
		{/if}
	</form>
</Card.Root>
