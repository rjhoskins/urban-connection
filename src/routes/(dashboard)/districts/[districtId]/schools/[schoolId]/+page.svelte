<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { users } from '$lib/store/users.svelte';

	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import AdminContactDetailsCard from '$lib/components/admin-contact-details-card.svelte';

	let { data } = $props();
	const {
		school: { name, schoolProgess },
		adminData
	} = data;
</script>

<h1 class="sr-only">Manage {name} School</h1>

<section class=" mx-auto grid max-w-7xl gap-4 p-2 lg:p-8">
	<Card.Root class=" p-4">
		<div class="top flex justify-between">
			<div class="left space-y-3">
				<p class=" text-2xl font-semibold">{name} | Dashboard</p>
				{#if adminData.length === 1}
					<p class=" text-2xl">Administrator</p>
				{:else}
					<p class=" text-2xl">Administrators</p>
				{/if}
				{#each adminData as admin (admin.adminEmail)}
					<AdminContactDetailsCard {admin} />
				{/each}
			</div>
			<div class="right md:min-w-96">
				<Button href={`${page.url.pathname}/send-assessment`} class="mb-4">Send Assessment</Button>

				<p>Not Started</p>
				<Progress barBgColor="bg-red-700" value={schoolProgess || Math.random() * 100} />
				<p>Completed</p>
				<Progress barBgColor="bg-green-700" value={schoolProgess || Math.random() * 100} />
			</div>
		</div>
	</Card.Root>
</section>
<!-- 
<pre class="">{JSON.stringify(data, null, 2)}</pre> -->
