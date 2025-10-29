<script lang="ts">
	import { page } from '$app/state';
	import SchoolGridCard from '$lib/components/school-grid-card.svelte';
	import SchoolListTable from '$lib/components/school-list-table.svelte';
	import { List, Grid2X2 } from 'lucide-svelte';
	let { data } = $props();
	let schoolProgess;
	let numSchoolsShown = $state(data.schools.length);
	let isGridView = $state(true);
	import { onMount } from 'svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	onMount(() => {
		// console.log('mounted');
		// console.log('data', data);
		globals.pageName = data.pageTitle;
	});
	function toggleView() {
		isGridView = !isGridView;
	}
</script>

<section class="flex h-full max-w-7xl flex-col">
	<h1 class="p4 sr-only my-6 text-center text-3xl">Manage All Schools</h1>
	<Card class="mb-14 flex justify-end gap-4 p-4">
		{#if browser && data.user.role === 'super_admin'}
			<Button
				href={`${window.location.origin}/create-school`}
				class="flex items-center justify-center"
				onclick={() => (isGridView = false)}>Add School</Button
			>
		{/if}
		<Button
			class="flex items-center justify-center"
			variant={`${!isGridView ? 'default' : 'secondary'}`}
			onclick={() => (isGridView = false)}><List /><span>List</span></Button
		>
		<Button
			variant={`${isGridView ? 'default' : 'secondary'}`}
			class="flex items-center justify-center"
			onclick={() => (isGridView = true)}><Grid2X2 /><span>Grid</span></Button
		>
	</Card>
	{#if isGridView}
		<div class="grid-cols-four-fluid grid gap-4">
			{#each data.schools as school (school.id)}
				<SchoolGridCard {page} {school} />
			{/each}
		</div>
	{:else}
		<SchoolListTable {page} schools={data.schools} />
	{/if}

	<p class="text-primary mt-auto text-[13.33px]">
		Showing {numSchoolsShown} of {data.schools.length} entries
	</p>
</section>
