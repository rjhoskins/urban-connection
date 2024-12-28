<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { createOrganizationSchema, type CreateOrganizationSchemaFormSchema } from '$lib/schema';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Card } from '$lib/components/ui/card';

	export let data: SuperValidated<Infer<CreateOrganizationSchemaFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(createOrganizationSchema)
	});

	const { form: formData, enhance } = form;
</script>

<h1>UC Admin Create</h1>

<Card class="mx-auto max-w-2xl">
	<form method="POST" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Organization Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.Description>This is the name the Organization will see when invited.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<button type="submit">Submits</button>
	</form>
</Card>
