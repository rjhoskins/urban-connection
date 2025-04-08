<script lang="ts">
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-grid-card.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { users } from '$lib/store/users.svelte';

	let { data } = $props();
</script>

<h1 class="sr-only my-6 text-center text-3xl">Manage All Schools</h1>

<section class=" sizes grid-cols-four-fluid container grid max-w-6xl gap-4 py-8">
	{#each data.schools as school (school.id)}
		<SchoolCard {page} {school} />
	{/each}
</section>

<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<!-- <pre class="sizes">{JSON.stringify(data, null, 2)}</pre> -->
