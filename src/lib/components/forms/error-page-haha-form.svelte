<script lang="ts">
	import { dev } from '$app/environment';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
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
		<Card.Description class="text-primary text-lg">
			Looks like you don't have the right access key for page or assessment. But while you're here,
			why not take our "Unauthorized User Assessment"?</Card.Description
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
										class="peer text-primary accent-primary focus:ring-primary/90 absolute top-1/2 left-0 h-6 w-6 -translate-y-1/2 rounded-lg border-gray-300"
										type="checkbox"
										{...props}
										bind:group={$formData.errorPageList}
										value={item}
									/>

									<label class="flex py-3" for={`custom-checkbox-${item}`}>
										<div class="mr-4 ml-10 flex flex-row items-center justify-between">
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
			{#if dev}
				<SuperDebug data={$formData} />
			{/if}
		</form>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full gap-4">
			<a
				class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				href="/auth/login">Go to Authorized Area</a
			>
			<a
				class={`ring-offset-background focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden ${
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
