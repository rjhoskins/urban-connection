<script lang="ts">
	import type { PageData } from './$types';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';

	const flash = getFlash(page);
	// function showMessage() {
	// 	$flash = { type: 'error', message: 'flashy ' };
	// }

	let { data }: { data: PageData } = $props();
	import { users } from '$lib/store/users.svelte';
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanelcopy from '$lib/components/schooladmin-admin-panel copy.svelte';
</script>

<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<h1 class="sr-only">Admin Panel</h1>
<div class="hi grid h-full place-content-center">
	<!-- <button on:click={showMessage}>Show flash message</button> -->
	{#if !data.user}
		<p class="my-6 text-center text-3xl">Please sign in</p>
	{:else if data.user.role == 'super_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<UCAdminPanel displayName={data.user?.name} />
	{:else if data.user.role == 'district_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<DistrictAdminPanel />
	{:else if data.user.role == 'school_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<SchooladminAdminPanelcopy />
	{:else}{/if}
	<!-- {#if users.selectedUser == 'UC'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<UCAdminPanel />
	{:else if users.selectedUser == 'District'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<DistrictAdminPanel />
	{:else if users.selectedUser == 'School_Admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<SchooladminAdminPanelcopy />
	{/if} -->

	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
	<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
</div>
