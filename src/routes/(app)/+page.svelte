<script lang="ts">
	import type { PageData } from './$types';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	let { data }: { data: PageData } = $props();
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanel from '$lib/components/schooladmin-admin-panel.svelte';
	let pageTitle = $state('Dashboard');
	$effect(() => {
		let roleTitle = '';
		if (data.user?.role === 'super_admin') roleTitle = 'Super Admin';
		else if (data.user?.role === 'district_admin') roleTitle = 'District Admin';
		else if (data.user?.role === 'school_admin') roleTitle = 'School Admin';

		pageTitle = `${roleTitle} Dashboard`;
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>
<h1 class="sr-only">Main Menu</h1>
<div class=" grid h-full place-content-center">
	{#if !data.user}
		<!-- <p class="my-6 text-center text-3xl">Please sign in</p> -->
	{:else if data.user.role == 'super_admin'}
		<UCAdminPanel />
	{:else if data.user.role == 'district_admin'}
		<DistrictAdminPanel district={data.data} />
	{:else if data.user.role == 'school_admin'}
		<SchooladminAdminPanel school={data.data} />
	{:else}{/if}
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</div>
