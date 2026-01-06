<script lang="ts">
	import { page } from '$app/state';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import NewSchoolForm from '$lib/components/forms/create-school-form.svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	let { data } = $props();

	let pageTitle = $state('Create School');

	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div class="grid h-full place-content-center">
	<NewSchoolForm {data} />
</div>
