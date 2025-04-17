<script lang="ts">
	import type { PageData } from './$types';
	import { globals } from '$lib/store/globals.svelte';

	let { data }: { data: PageData } = $props();
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanel from '$lib/components/schooladmin-admin-panel.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		globals.setPageName('Main Menu');
	});
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
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
