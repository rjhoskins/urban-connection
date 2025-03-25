<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanel from '$lib/components/schooladmin-admin-panel.svelte';
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<div class="hi grid h-full place-content-center pb-6">
	{#if !data.user}
		<p class="my-6 text-center text-3xl">Please sign in</p>
	{:else if data.user.role == 'super_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<UCAdminPanel displayName={data.user?.name} />
	{:else if data.user.role == 'district_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<DistrictAdminPanel displayName={data.user?.name} district={data.data} />
	{:else if data.user.role == 'school_admin'}
		<h1 class="my-6 text-center text-3xl">{data.user?.name} | Admin Panel</h1>
		<SchooladminAdminPanel displayName={data.user?.name} school={data.data} />
	{:else}{/if}
	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</div>
