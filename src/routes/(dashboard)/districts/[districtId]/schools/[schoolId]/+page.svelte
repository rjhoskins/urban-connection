<script lang="ts">
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { adminData, school, assessmentData, memberData } = data;

	let pageTitle = $state(`${school.name} | Dashboard`);
	onMount(() => {
		globals.setPageName(pageTitle);
	});
</script>

<!-- <svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Manage ${school.name} School`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={`Manage ${school.name} School`} />
	<meta property="og:image" content="/images/urban-connection-logo.png" />
	<meta property="og:url" content={window.location.href} />
	<link rel="icon" href="/images/urban-connection-logo.png" type="image/png" />
</svelte:head> -->

{@render children?.()}
