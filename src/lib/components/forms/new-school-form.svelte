<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card';
	import { createSchoolSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	const { districts } = data;
	let selectedDistrict = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(createSchoolSchema)

		// onResult({ result }) {
		// 	if (result.status === 200) {
		// 		form.reset();
		// 		console.log('onResult => ', result);
		// 		$formData.districtId = 0;
		// 	}
		// }
	});
	const { form: formData, enhance, message } = form;
</script>

<Card.Root class="mx-auto max-w-6xl">
	<Card.Header>
		<Card.Title class="text-3xl">Create School</Card.Title>
		<Card.Description class="text-sm text-primary/75">Create a new School</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<!-- name -->
			<Field {form} name="name">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>School Name</Label>
						<input
							{...props}
							type="text"
							name="name"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter School Name"
							bind:value={$formData.name}
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>
			<!-- district -->
			<Field {form} name="districtId">
				<Control>
					{#snippet children({ props })}
						<Label>District Name</Label>
						<Select.Root
							type="single"
							selected={$formData.districtId}
							onSelectedChange={(s) => {
								console.log('selected district => ', s);
								if (s) {
									$formData.districtId = s.value;
								}
							}}
						>
							<Select.Trigger>
								<Select.Value placeholder="Select a district" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<!-- <Select.Label>Fruits</Select.Label> -->
									{#each districts as district}
										<Select.Item value={district.id} label={district.name}
											>{district.name}</Select.Item
										>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input class="sizes" name="districtId" /><!-- must match! -->
						</Select.Root>
					{/snippet}
				</Control>
				<FieldErrors class="text-red-700" />
			</Field>

			<!-- adminName -->
			<Field {form} name="adminName">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>School Admin Name</Label>
						<input
							{...props}
							type="text"
							name="adminName"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter School Admin Name"
							bind:value={$formData.adminName}
						/>
					{/snippet}
				</Control>
				<Description class="text-sm text-primary/50">Name to be used in admin invite</Description>
				<FieldErrors class="text-red-700" />
			</Field>
			<!-- adminEmail -->
			<Field {form} name="adminEmail">
				<Control>
					{#snippet children({ props }: { props: any })}
						<Label>School Admin Email</Label>
						<input
							{...props}
							type="text"
							name="adminEmail"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							placeholder="Enter School Admin Email"
							bind:value={$formData.adminEmail}
						/>
					{/snippet}
				</Control>
				<Description class="text-sm text-primary/50"
					>Email to be used in admin invite: should be their school email</Description
				>
				<FieldErrors class="text-red-700" />
			</Field>
			<button
				type="submit"
				tabindex="0"
				class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			>
				Submit
			</button>

			{#if $message}
				<div class="message text-green-700">{$message}</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>

<Card.Root class="container mx-auto mt-20 max-w-4xl p-4">
	<SuperDebug data={$formData} />

	<pre>{JSON.stringify(data.districts, null, 2)}</pre>
	<pre class="sizes">{JSON.stringify($formData, null, 2)}</pre>
</Card.Root>
