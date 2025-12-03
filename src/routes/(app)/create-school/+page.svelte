<script lang="ts">
	import { page } from '$app/state';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import NewSchoolForm from '$lib/components/forms/create-school-form.svelte';

	let { data } = $props();
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	$effect(() => {
		console.log('effect page');
		console.log('data', data);
		globals.pageName = 'Create School';
	});
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class=" h-full max-w-7xl">
	<NewSchoolForm {data} />
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</div>
