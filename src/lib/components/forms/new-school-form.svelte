<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card';
	import { createSchoolSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

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
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>School Name</Form.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="districtId">
				<Form.Control>
					{#snippet children({ props }: { props: any })}
						<Form.Label>District</Form.Label>
						<Select.Root type="single" name={props.name} bind:value={$formData.districtId}>
							<Select.Trigger class="">
								{$formData.districtId == 0
									? 'Select a district'
									: districts.find((el) => el.id == $formData.districtId).name}
							</Select.Trigger>
							<Select.Content class="">
								{#each districts as district}
									<Select.Item class="" value={district.id} label={district.name}
										>{district.name}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- adminName -->
			<Form.Field {form} name="adminName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Admin Name</Form.Label>
						<Input {...props} bind:value={$formData.adminName} />
					{/snippet}
				</Form.Control>
				<Form.Description>Name to be used in admin invite</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<!-- adminName -->
			<Form.Field {form} name="adminEmail">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Admin Email</Form.Label>
						<Input type="email" {...props} bind:value={$formData.adminEmail} />
					{/snippet}
				</Form.Control>

				<Form.Description
					>Email to be used in admin invite: should be their school email</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>Submit</Form.Button>

			{#if $message}
				<div class="message text-green-700">{$message}</div>
			{/if}
		</form>
	</Card.Content>
	<SuperDebug data={$formData} />
	<pre>{JSON.stringify(districts, null, 2)}</pre>
</Card.Root>
