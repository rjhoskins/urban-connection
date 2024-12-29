<script lang="ts">
	import AdminPanel from '$lib/components/admin-panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="my-6 text-center text-3xl">Urban Connection Admin Panel</h1>

<div class="hi grid h-full place-content-center">
	<AdminPanel />
</div>
