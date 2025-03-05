<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Field, Control, Fieldset } from 'formsnap';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { schema, errorPageList } from '$lib/schema';
	import * as Card from '$lib/components/ui/card';
	import { ShieldAlertIcon } from 'lucide-svelte';
	let { data } = $props();

	let isDisabled = $state(true);

	let localFormData = $state({
		form: {
			errorPageList: []
		}
	});

	const form = superForm(localFormData.form, {
			validators: zodClient(schema)
		}),
		{ form: formData, enhance } = form;
</script>

<Card.Root class="mx-auto max-w-xl shadow-xl">
	<Card.Header>
		<Card.Title class="flex items-center justify-center gap-2 pb-6 text-3xl">
			<ShieldAlertIcon class="size-8 text-red-700" /><span>Oops! Unauthorized Access</span
			></Card.Title
		>
		<Card.Description class="text-lg text-primary">
			Looks like you don't have the right access key for page or survey. But while you're here, why
			not take our "Unauthorized User Survey"?</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<form use:enhance class="mx-auto flex flex-col" method="POST">
			<Fieldset {form} name="errorPageList" class="flex flex-col gap-1">
				{#each errorPageList as item}
					<Control>
						{#snippet children({ props })}
							<div class="flex items-center gap-3">
								<div class="relative">
									<input
										class="peer absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-lg border-gray-300 text-primary accent-primary focus:ring-primary/90"
										type="checkbox"
										{...props}
										bind:group={$formData.errorPageList}
										value={item}
									/>

									<label class="flex py-3" for={`custom-checkbox-${item}`}>
										<div class="ml-10 mr-4 flex flex-row items-center justify-between">
											<div>
												<h3 class="font-bold">{item}</h3>
											</div>
										</div>
									</label>
								</div>
							</div>
						{/snippet}
					</Control>
				{/each}
			</Fieldset>
			<!-- <SuperDebug data={$formData} /> -->
		</form>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full gap-4">
			<a
				class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href="/auth/login">Go to Authorized Area</a
			>
			<a
				class={`inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
					$formData.errorPageList.length == errorPageList.length
						? 'bg-primary text-primary-foreground hover:bg-primary/90'
						: 'pointer-events-none bg-gray-400 text-gray-500 opacity-50'
				}`}
				href="/auth/login"
				aria-disabled={isDisabled}
			>
				Submit
			</a>
		</div>
	</Card.Footer>
</Card.Root>
