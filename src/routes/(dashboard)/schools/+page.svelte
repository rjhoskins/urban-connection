<script lang="ts">
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';

	let { data } = $props();
	let schoolProgess;
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All Schools</h1>

<section class=" container grid max-w-6xl grid-cols-schools-fluid gap-4 py-8">
	{#each data.schools as school (school.id)}
		<SchoolCard {page} {school} />
	{/each}
</section>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<pre class="sizes">{JSON.stringify(data, null, 2)}</pre>
