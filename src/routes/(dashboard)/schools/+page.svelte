<script lang="ts">
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';

	let { data } = $props();
	let schoolProgess;
	let numSchoolsShown = $state(data.schools.length);
	import { onMount } from 'svelte';
	import { globals } from '$lib/store/globals.svelte';
	onMount(() => {
		console.log('mounted');
		console.log('data', data);
		globals.pageName = data.pageTitle;
	});
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All Schools</h1>

<section class="flex h-full flex-col">
	<div class="grid-cols-three-fluid grid gap-4">
		{#each data.schools as school (school.id)}
			<SchoolCard {page} {school} />
		{/each}
	</div>
	<p class="text-primary mt-auto text-[13.33px]">
		Showing {numSchoolsShown} of {data.schools.length} entries
	</p>

	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
</section>
