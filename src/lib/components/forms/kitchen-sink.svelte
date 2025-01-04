<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Field, Control, Label, Description, FieldErrors, Fieldset, Legend } from 'formsnap';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { schema, allergies, themes, colors } from '$lib/schema';
	import SuperDebug from 'sveltekit-superforms';
	import { districts } from '$lib/data/data';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let { data } = $props();
	let selectedDistrict = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(schema)
	});
	const { form: formData, enhance } = form;
</script>

<form use:enhance class="mx-auto flex max-w-md flex-col" method="POST">
	<Field {form} name="email">
		<Control>
			{#snippet children({ props })}
				<Label>Email</Label>
				<input
					class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...props}
					type="email"
					bind:value={$formData.email}
				/>
			{/snippet}
		</Control>
		<Description>Company email is preferred</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="bio">
		<Control>
			{#snippet children({ props })}
				<Label>Bio</Label>
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<textarea {...props} bind:value={$formData.bio} />
			{/snippet}
		</Control>
		<Description>Tell us a bit about yourself.</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="fruit">
		<Control>
			{#snippet children({ props })}
				<Label>Fruit, Baby</Label>
				<Select.Root
					type="single"
					onSelectedChange={(s) => {
						$formData.fruit = s.value;
					}}
					bind:value={$formData.fruit}
				>
					<Select.Trigger>
						<Select.Value bind:value={$formData.fruit} placeholder="Select a fruit" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<!-- <Select.Label>Fruits</Select.Label> -->
							{#each [{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }, { value: 'blueberry', label: 'Blueberry' }, { value: 'grapes', label: 'Grapes' }, { value: 'pineapple', label: 'Pineapple' }] as fruit}
								<Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="fruit" />
				</Select.Root>
			{/snippet}
		</Control>
		<Description>Help us address you properly.</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="language">
		<Control>
			{#snippet children({ props })}
				<Label>Language</Label>
				<select {...props} bind:value={$formData.language}>
					<option value="fr">French</option>
					<option value="es">Spanish</option>
					<option value="en">English</option>
				</select>
			{/snippet}
		</Control>
		<Description>Help us address you properly.</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="colors">
		<Control>
			{#snippet children({ props })}
				<Label>Favorite colors</Label>
				<Select.Root
					onValueChange={(e) => console.log('value change', e)}
					type="multiple"
					bind:value={$formData.colors}
					name={props.name}
				>
					<Select.Trigger onchange={(e) => console.log('trigger', e)} {...props}>
						<p>Colors</p>
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(colors) as [value, label]}
							<Select.Item {value} {label} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Control>
		<Description>We'll use these colors to customize your experience.</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="district">
		<Control>
			{#snippet children({ props })}
				<Label>District</Label>
				<select {...props} bind:value={$formData.district}>
					<option value="fr">French</option>
					<option value="es">Spanish</option>
					<option value="en">English</option>
				</select>
			{/snippet}
		</Control>
		<Description>Help us address you properly.</Description>
		<FieldErrors />
	</Field>
	<Field {form} name="district">
		<Control>
			{#snippet children({ props })}
				<Label>Favorite district</Label>
				<Select.Root type="single" bind:value={$formData.district} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.district || 'Select a district'}
					</Select.Trigger>
					<Select.Content>
						{#each districts as district (district.id)}
							<Select.Item value={district.name} label={district.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.district} name={props.name} />
			{/snippet}
		</Control>
		<Description>We'll use these colors to customize your experience.</Description>
		<FieldErrors />
	</Field>
	<Fieldset {form} name="theme">
		<Legend>Select your theme</Legend>
		{#each themes as theme}
			<Control>
				{#snippet children({ props })}
					<Label>{theme}</Label>
					<input {...props} type="radio" value={theme} bind:group={$formData.theme} />
				{/snippet}
			</Control>
		{/each}
		<Description>We prefer dark mode, but the choice is yours.</Description>
		<FieldErrors />
	</Fieldset>
	<Field {form} name="marketingEmails">
		<Control>
			{#snippet children({ props })}
				<input {...props} type="checkbox" bind:checked={$formData.marketingEmails} />
				<Label>I want to receive marketing emails</Label>
			{/snippet}
		</Control>
		<Description>Stay up to date with our latest news and offers.</Description>
		<FieldErrors />
	</Field>
	<Fieldset {form} name="allergies">
		<Legend>Food allergies</Legend>
		{#each allergies as allergy}
			<Control>
				{#snippet children({ props })}
					<input {...props} type="checkbox" bind:group={$formData.allergies} value={allergy} />
					<Label>{allergy}</Label>
				{/snippet}
			</Control>
		{/each}
		<Description>When we provide lunch, we'll accommodate your needs.</Description>
		<FieldErrors />
	</Fieldset>
	<button>Submit</button>
</form>
<SuperDebug data={$formData} />
