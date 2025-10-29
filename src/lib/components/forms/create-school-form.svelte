<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card';
	import { createSchoolSchema } from '$lib/schema.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button';

	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Switch } from '../ui/switch';
	import { dev } from '$app/environment';
	import { LoaderCircle, TriangleAlert } from 'lucide-svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	let { isDistrict = $bindable(), data } = $props();
	const { districts } = data;
	const districtsWithoutAdmin = districts.filter(
		(district: { adminId: null }) => district.adminId == null
	);

	let currDistricts = $state(districts);
	let selectedDistrict = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(createSchoolSchema)
	});
	const { form: formData, enhance, message, delayed, tainted, submitting } = form;

	let unSavedChangesModalOpen = $state(false);
	let navigateToUrl = $state('');
	let formHasBeenUpdated = $state(false);
	beforeNavigate(async ({ to, cancel }) => {
		if (submitting) return;
		if (tainted && formHasBeenUpdated) {
			cancel();
			unSavedChangesModalOpen = true;
			navigateToUrl = to?.url.href;
		}
		formHasBeenUpdated = false;
	});
	function handleLeave() {
		unSavedChangesModalOpen = false;
		goto(navigateToUrl);
	}
	formData.update(
		($formData) => {
			formHasBeenUpdated = true;
			return $formData;
		},
		{ taint: false }
	);

	function handleIsDistrictToggle() {
		$formData.districtId = 0;

		if ($formData.isDistrict) {
			globals.pageName = 'Add District Admin to District';
			currDistricts = districtsWithoutAdmin;
		} else {
			globals.pageName = 'Create School';
			currDistricts = districts;
		}
	}
</script>

<Card.Root class="w-full rounded-md p-9">
	<h2 class="text-2xl text-[#4B5563] capitalize">
		{#if $formData.isDistrict}
			Add a District Admin to a district
		{:else}
			Create a new School
		{/if}
	</h2>

	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<div class="flex w-full gap-3">
				{#if districtsWithoutAdmin.length > 0}
					<Form.Field {form} name="isDistrict" class="w-full">
						<div class="flex flex-row items-center gap-4">
							<Form.Control>
								{#snippet children({ props })}
									<Switch
										onCheckedChange={handleIsDistrictToggle}
										{...props}
										bind:checked={$formData.isDistrict}
									/>
									<div class="space-y-0.5">
										<Form.Label>Create District</Form.Label>
										<Form.Description
											>Create a distrct admin for the selected district</Form.Description
										>
									</div>
								{/snippet}
							</Form.Control>
						</div>
						<Form.FieldErrors />
					</Form.Field>
				{/if}
				{#if !$formData.isDistrict}
					<!-- name -->
					<Form.Field class="w-full" {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>School Name*</Form.Label>
								<Input
									class=" w-full"
									placeholder="Enter School Name"
									{...props}
									bind:value={$formData.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<!-- district (id) -->
				<Form.Field class="w-full" {form} name="districtId">
					<Form.Control>
						{#snippet children({ props }: { props: any })}
							<Form.Label>Select School District*</Form.Label>
							<Select.Root type="single" name={props.name} bind:value={$formData.districtId}>
								<Select.Trigger class="w-full">
									{$formData.districtId == 0
										? 'Select  District'
										: districts.find((el: { id: any }) => el.id == $formData.districtId).name}
								</Select.Trigger>
								<Select.Content class="w-full">
									{#each currDistricts as district}
										<Select.Item class="w-full" value={district.id} label={district.name}
											>{district.name}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<!-- adminName -->
			<Form.Field {form} name="adminName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Administrator Name*</Form.Label>
						<Input
							placeholder="Enter Administrator Name"
							{...props}
							bind:value={$formData.adminName}
						/>
					{/snippet}
				</Form.Control>
				<!-- <Form.Description>Name to be used in admin invite</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex w-full gap-3">
				<!-- adminName -->
				<Form.Field class="w-full" {form} name="adminEmail">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Admin Email*</Form.Label>
							<Input
								placeholder="Enter Email Address"
								type="email"
								{...props}
								bind:value={$formData.adminEmail}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!-- adminName -->
				<Form.Field class="w-full" {form} name="adminPhone">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Admin Phone</Form.Label>
							<Input
								placeholder="Enter Phone Number"
								{...props}
								bind:value={$formData.adminPhone}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex gap-3">
				<Form.Button variant="secondary" href="/schools" class="w-fit">Cancel</Form.Button>
				<Form.Button class="w-fit" type="submit">
					{#if $delayed}
						<LoaderCircle class="animate-spin" />
						Submitting...
					{:else if $formData.isDistrict}
						Add District Admin
					{:else}
						Create School
					{/if}
				</Form.Button>
			</div>
		</form>
	</Card.Content>
	{#if dev}
		<SuperDebug data={$formData} />
	{/if}
</Card.Root>

<Dialog.Root bind:open={unSavedChangesModalOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class=" flex items-center gap-2 p-1 text-xl text-[#371E98]"
				><TriangleAlert class="h-5 w-5" /><span class="block">Unsaved Changes</span></Dialog.Title
			>
			<Dialog.Description>
				You have unsaved changes. Are you sure you want to leave this page? Your changes will be
				lost.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex gap-4">
			<Button
				variant="secondary"
				onclick={() => (unSavedChangesModalOpen = !unSavedChangesModalOpen)}
				class="w-full">Stay On Page</Button
			>
			<Button onclick={handleLeave} class="w-full">Leave Page</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
