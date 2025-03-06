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
	const { district, adminData, memberSurveyData } = data as unknown as {
		district: District;
		adminData: Array<Record<string, any>> | Record<string, any>;
		memberSurveyData: Array<{ id: string; [key: string]: any }>;
	};
</script>

<h1 class="sr-only text-2xl font-semibold">District || {district.name}</h1>

<section class=" container grid max-w-6xl p-4 py-8">
	<div class="left space-y-3 pt-3">
		{#if adminData}
			<Card class="p-4">
				{#if !Array.isArray(adminData)}
					<p class=" text-2xl">District Administrator</p>
					<AdminContactDetailsCard admin={adminData} />
				{:else}
					<!-- just in case  -->
					<p class=" text-2xl">Administrators</p>
					{#each adminData as admin, idx (idx)}
						<AdminContactDetailsCard {admin} />
					{/each}
				{/if}
			</Card>
		{:else}
			<Card class="p-4">
				<p class=" text-xl font-semibold">No Admins Found</p>
			</Card>
		{/if}
	</div>
	<div class=" grid-cols-schools-fluid grid max-w-6xl gap-4 py-8">
		{#each memberSurveyData as school (school.id)}
			<SchoolCard isNested {page} {school} />
		{/each}
	</div>
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
