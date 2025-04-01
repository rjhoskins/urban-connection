<script lang="ts">
	import type { PageData } from './$types';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';
	import SchoolCard from '$lib/components/school-card.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Button } from '$lib/components/ui/button';

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
	const { district, adminData, memberAssessmentData } = data as unknown as {
		district: District;
		adminData: Array<Record<string, any>> | Record<string, any>;
		memberAssessmentData: Array<{ id: string; [key: string]: any }>;
	};
</script>

<h1 class="sr-only text-2xl font-semibold">District || {district.name}</h1>

<section class=" container grid max-w-6xl p-4 py-8">
	<div class="left space-y-3 pt-3">
		<Card class=" flex justify-between p-4">
			{#if adminData}
				<div class="">
					{#if !Array.isArray(adminData)}
						<p class="text-2xl">District Administrator</p>
						<AdminContactDetailsCard admin={adminData} />
					{:else if adminData.length > 0}
						<p class="text-2xl">Administrators</p>
						{#each adminData as admin, idx (idx)}
							<AdminContactDetailsCard {admin} />
						{/each}
					{:else}
						<p class="text-xl font-semibold">No Admins Found</p>
					{/if}
				</div>
			{/if}

			<Button href={`${page.url.pathname}/results`} class="ml-auto">View Results</Button>
		</Card>
	</div>
	<div class=" grid-cols-three-fluid grid max-w-6xl gap-4 py-8">
		{#each memberAssessmentData as school (school.id)}
			<SchoolCard isNested {page} {school} />
		{/each}
	</div>
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
