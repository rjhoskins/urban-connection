<script lang="ts">
	import type { PageData } from './$types';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

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
	const { district, adminData, memberSurveyData } = data as {
		district: District;
		adminData: unknown;
		memberSurveyData: Array<{ id: string; [key: string]: any }>;
	};
</script>

<h1 class="text-2xl font-semibold">District || {district.name}</h1>

<section class=" container grid max-w-6xl p-4 py-8">
	<div class="left space-y-3 pt-3">
		{#if adminData}
			{#if adminData?.length === 1}
				<p class=" text-2xl">Administrator</p>
			{:else}
				<p class=" text-2xl">Administrators</p>
			{/if}
			{#each adminData as admin, idx (idx)}
				<AdminContactDetailsCard {admin} />
			{/each}
		{:else}
			<Card class="p-4">
				<p class=" text-xl font-semibold">No Admins Found</p>
			</Card>
		{/if}
	</div>
	<div class=" grid max-w-6xl grid-cols-schools-fluid gap-4 py-8">
		{#each memberSurveyData as school (school.id)}
			<SchoolCard isNested {page} {school} />
		{/each}
	</div>
</section>
<!-- <pre>{JSON.stringify(adminData, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(district, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(memberSurveyData, null, 2)}</pre> -->
