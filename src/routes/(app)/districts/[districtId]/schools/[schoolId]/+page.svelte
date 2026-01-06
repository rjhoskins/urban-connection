<script lang="ts">
	import { page } from '$app/state';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { stripeProducts, schoolWithAdmins, memberData, isSuperAdmin } = data;

	let pageTitle = $state(`${schoolWithAdmins.name} | Dashboard`);
	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{@render children?.()}
