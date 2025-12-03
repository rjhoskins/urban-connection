<script lang="ts">
	import { page } from '$app/state';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { stripeProducts, schoolWithAdmins, memberData, isSuperAdmin } = data;

	let pageTitle = $state(`${schoolWithAdmins.name} | Dashboard`);
	onMount(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Manage ${schoolWithAdmins.name} School`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={`Manage ${schoolWithAdmins.name} School`} />
	<meta property="og:image" content="/img/urban-connection-logo.png" />
	<meta property="og:url" content={page.url.href} />
	<link rel="icon" href="/img/urban-connection-logo.png" type="image/png" />
</svelte:head>

{@render children?.()}
