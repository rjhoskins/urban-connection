<script lang="ts">
	import { page } from '$app/state';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import NewSchoolForm from '$lib/components/forms/create-school-form.svelte';

	let { data } = $props();
	import { onMount } from 'svelte';
	import { globals } from '$lib/store/globals.svelte';
	onMount(() => {
		console.log('mounted');
		console.log('data', data);
		globals.pageName = 'Create School';
		globals.pageName = globals.pageName ? globals.pageName : data.pageTitle;
	});
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="sizes h-full">
	<NewSchoolForm {data} />
</div>
