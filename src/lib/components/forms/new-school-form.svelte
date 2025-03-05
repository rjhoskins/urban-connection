<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card';
	import { createSchoolSchema } from '$lib/schema.js';

	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Switch } from '../ui/switch';
	import { dev } from '$app/environment';

	let { isDistrict = $bindable(), data } = $props();
	const { districts } = data;
	let selectedDistrict = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(createSchoolSchema)
	});
	const { form: formData, enhance, message } = form;

	$effect(() => {
		$formData.isDistrict = isDistrict;
		// if ($formData.isDistrict) {
		// 	$formData.name = '';
		// }
	});
</script>

<Card.Root class="mx-auto max-w-md">
	<Card.Header>
		<Card.Title class="text-3xl"
			>Create
			{#if $formData.isDistrict}
				District Admin
			{:else}
				School
			{/if}
		</Card.Title>
		<Card.Description class="text-primary/75 text-sm">
			{#if $formData.isDistrict}
				Add a District Admin to a district
			{:else}
				Create a new School
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<Form.Field {form} name="isDistrict">
				<div class="flex flex-row items-center justify-between gap-4">
					<Form.Control>
						{#snippet children({ props })}
							<Switch {...props} bind:checked={$formData.isDistrict} />
							<div class="space-y-0.5">
								<Form.Label>Create District</Form.Label>
								<Form.Description>Create a distrct admin for the selected district</Form.Description
								>
							</div>
						{/snippet}
					</Form.Control>
				</div>
				<Form.FieldErrors />
			</Form.Field>
			{#if !$formData.isDistrict}
				<!-- name -->
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>School Name *</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<Form.Field {form} name="districtId">
				<Form.Control>
					{#snippet children({ props }: { props: any })}
						<Form.Label>District *</Form.Label>
						<Select.Root type="single" name={props.name} bind:value={$formData.districtId}>
							<Select.Trigger class="">
								{$formData.districtId == 0
									? 'Select a district'
									: districts.find((el: { id: any }) => el.id == $formData.districtId).name}
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
						<Form.Label>Admin Name *</Form.Label>
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
						<Form.Label>Admin Email *</Form.Label>
						<Input type="email" {...props} bind:value={$formData.adminEmail} />
					{/snippet}
				</Form.Control>

				<Form.Description
					>Email to be used in admin invite: should be their school email</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>
			<!-- adminName -->
			<Form.Field {form} name="adminPhone">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Admin Phone</Form.Label>
						<Input {...props} bind:value={$formData.adminPhone} />
					{/snippet}
				</Form.Control>

				<Form.Description>optional</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button>Submit</Form.Button>
		</form>
	</Card.Content>
	{#if dev}
		<SuperDebug data={$formData} />
	{/if}
</Card.Root>
