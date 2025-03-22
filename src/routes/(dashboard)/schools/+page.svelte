<script lang="ts">
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';

	let { data } = $props();
	let schoolProgess;
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All Schools</h1>

<section class=" grid-cols-three-fluid container grid max-w-6xl gap-4 py-8">
	{#each data.schools as school (school.id)}
		<SchoolCard {page} {school} />
	{/each}
</section>
