<script lang="ts">
	import NewOrganizationForm from '$lib/components/forms/new-organization-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createOrganizationSchema } from '$lib/schema.js';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

	let { data } = $props();
</script>

<h1 class="my-6 text-center text-3xl">UC Admin Create</h1>

<NewOrganizationForm data={data.form} />
