<script lang="ts">
	import type { PageData } from './$types';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';

	const flash = getFlash(page);
	// function showMessage() {
	// 	$flash = { type: 'error', message: 'flashy ' };
	// }

	let { data }: { data: PageData } = $props();
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanel from '$lib/components/schooladmin-admin-panel.svelte';
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<h1 class="sr-only">Admin Panel</h1>
<div class="hi grid h-full place-content-center">
	{#if !data.user}
		<p class="my-6 text-center text-3xl">Please sign in</p>
	{:else if data.user.role == 'super_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<UCAdminPanel displayName={data.user?.name} />
	{:else if data.user.role == 'district_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<DistrictAdminPanel />
	{:else if data.user.role == 'school_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<SchooladminAdminPanel displayName={data.user?.name} school={data.loggedInAdminSchool} />
	{:else}{/if}
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</div>
