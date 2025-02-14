<script lang="ts">
	import type { PageData } from './$types';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';

	interface School {
		id: string;
		// add other school properties as needed
	}

	interface District {
		name: string;
		schools: School[];
		// add other district properties as needed
	}

	let { data }: { data: PageData } = $props();
	const { district, adminData } = data as { district: District; adminData: unknown };
</script>

<h1 class="text-2xl font-semibold">District || {district.name}</h1>
<div class="left space-y-3 pt-3">
	{#if adminData}
		<p class=" text-2xl">District Administrator</p>
		<AdminContactDetailsCard admin={adminData} />
	{/if}
</div>
<section class=" container grid max-w-6xl grid-cols-schools-fluid gap-4 py-8">
	{#each district.schools as school (school.id)}
		<SchoolCard isNested {page} {school} />
	{/each}
</section>
<!-- <pre>{JSON.stringify(adminData, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(district, null, 2)}</pre> -->
