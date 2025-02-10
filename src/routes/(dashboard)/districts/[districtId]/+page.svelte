<script lang="ts">
	import DistrictCard from '$lib/components/district-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { district, admin } = data;
</script>

<h1>District || {district.name}</h1>
<pre>{JSON.stringify(admin, null, 2)}</pre>
<pre>{JSON.stringify(district, null, 2)}</pre>
<ul class=" grid grid-cols-schools-fluid gap-4"></ul>
