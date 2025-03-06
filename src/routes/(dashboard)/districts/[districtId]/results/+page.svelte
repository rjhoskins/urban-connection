<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="text-center text-3xl font-bold text-gray-900">Results for this District</h1>
	<div class="content-wrapper">what results go here?</div>
</section>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
