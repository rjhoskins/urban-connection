<script lang="ts">
	import { page } from '$app/state';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

	import NewSchoolForm from '$lib/components/forms/create-school-form.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="grid h-full place-content-center">
	<NewSchoolForm {data} />
</div>
