<script lang="ts">
	import AdminPanel from '$lib/components/admin-panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>UC Admin Invite</h1>
