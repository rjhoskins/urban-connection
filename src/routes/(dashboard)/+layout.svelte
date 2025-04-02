<script lang="ts">
	import Navbar from '$lib/components/layout/navbar.svelte';

	// const flash = getFlash(page);
	let { children, data } = $props();
</script>

<div class="relative flex h-full flex-col">
	<Navbar {data} />
	<main class="grow">
		{@render children()}
	</main>
</div>
