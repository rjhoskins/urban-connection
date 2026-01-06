<script lang="ts">
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import { page } from '$app/state';

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { stripeProducts, schoolWithAdmins, memberData } = data;

	let pageTitle = $state(`${schoolWithAdmins.name} | Dashboard`);
	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>
<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->

{@render children?.()}
