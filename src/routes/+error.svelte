<script lang="ts">
	import { page } from '$app/stores';
	import ErrorPageHahaForm from '$lib/components/forms/error-page-haha-form.svelte';
	import { Root } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<svelte:head>
	<title>Oops!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="grid h-full place-content-center">
	<ErrorPageHahaForm {data} />
</div>
