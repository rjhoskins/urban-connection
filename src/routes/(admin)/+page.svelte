<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';

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
<h1 class="sr-only">admin {data.user?.name}</h1>
<div class="hi grid h-full place-content-center">
	{#if data.role == 'super_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<UCAdminPanel />
	{:else if data.role == 'district_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<DistrictAdminPanel />
	{:else if data.role == 'school_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} Admin Panel</h1>
		<SchooladminAdminPanelcopy />
	{/if}
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

	<pre>{JSON.stringify(data, null, 2)}</pre>
	<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
</div>
