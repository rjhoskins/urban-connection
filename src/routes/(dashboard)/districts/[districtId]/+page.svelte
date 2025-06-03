<script lang="ts">
	import type { PageData } from './$types';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';
	import { page } from '$app/state';
	import SchoolGridCard from '$lib/components/school-grid-card.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Grid2X2, List } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { globals } from '$lib/store/globals.svelte';

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
	let isGridView = $state(true);

	onMount(() => {
		globals.setPageName('Manage District | ' + district.name);
	});
</script>

<h1 class="sr-only">District || {district.name}</h1>

<section class="grid max-w-7xl">
	<div class=" space-y-3 pt-3">
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
	<Card class="mt-5 mb-14 flex justify-end gap-4 p-4">
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

	<div class=" grid-cols-four-fluid grid gap-4">
		{#if isGridView}
			{#each memberAssessmentData as school (school.id)}
				<SchoolGridCard isNested {page} {school} />
			{/each}
		{:else}
			<p>here</p>
			<!-- <MemberAssessmentResultsListTable {school} {page} members={data.memberData} /> -->
		{/if}
	</div>
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
