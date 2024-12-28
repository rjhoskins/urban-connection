<script lang="ts">
	import { createOrganizationSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createOrganizationSchema)
	});
	const { form: formData, enhance, message } = form;
</script>

<h1>UC Admin Create</h1>

<form method="POST" use:enhance>
	<label for="name">Name</label>
	<input type="text" name="name" bind:value={$formData.name} />

	<div><button>Submit</button></div>
</form>

<SuperDebug data={$formData} />
<form method="POST" use:enhance>
	<Field {form} name="name">
		<Control>
			{#snippet children({ props })}
				<Label>Name</Label>
				<input {...props} type="email" bind:value={$formData.name} />
			{/snippet}
		</Control>
		<Description>Tell us a bit about yourself.</Description>
		<FieldErrors class="text-red-700" />
	</Field>
</form>

{#if $message}
	<div class="message">{$message}</div>
{/if}
<pre>{JSON.stringify(data, null, 2)}</pre>
<pre class="sizes">{JSON.stringify($formData, null, 2)}</pre>
