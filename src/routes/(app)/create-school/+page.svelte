<script lang="ts">
	import { page } from '$app/state';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import NewSchoolForm from '$lib/components/forms/create-school-form.svelte';

	let { data } = $props();
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	let pageTitle = $state('Create School');
	$effect(() => {
		globals.pageName = pageTitle;
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div class=" h-full max-w-7xl">
	<NewSchoolForm {data} />
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</div>
