<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	import { users } from '$lib/store/users.svelte';
	import UCAdminPanel from '$lib/components/uc-admin-panel.svelte';
	import DistrictAdminPanel from '$lib/components/district-admin-panel.svelte';
	import SchooladminAdminPanelcopy from '$lib/components/schooladmin-admin-panel copy.svelte';
</script>

<div class="hi grid h-full place-content-center">
	{#if users.selectedUser == 'UC'}
		<h1 class="my-6 text-center text-3xl">Urban Connection Admin Panel</h1>
		<UCAdminPanel />
	{:else if users.selectedUser == 'District'}
		<h1 class="my-6 text-center text-3xl">Disctrict Admin Panel</h1>
		<DistrictAdminPanel />
	{:else if users.selectedUser == 'School_Admin'}
		<h1 class="my-6 text-center text-3xl">School Admin Admin Panel</h1>
		<SchooladminAdminPanelcopy />
	{/if}
</div>
