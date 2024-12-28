<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { createOrganizationSchema, type CreateOrganizationSchemaFormSchema } from '$lib/schema';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<CreateOrganizationSchemaFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(createOrganizationSchema)
	});

	const { form: formData, enhance } = form;
</script>

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
	<button type="submit">Submit</button>
</form>

<form method="post" action="?/login" use:enhance>
	<label>
		Username
		<input name="username" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<button>Login</button>
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
