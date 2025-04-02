<script lang="ts">
	import SideDrawerNav from '$lib/components/layout/side-drawer-nav.svelte';
	import TopNavbar from '$lib/components/layout/top-navbar.svelte';

	// const flash = getFlash(page);
	let { children, data } = $props();
</script>

<!-- pl-24 = drawer offset -->
<div class="relative flex h-full flex-col pl-24">
	<SideDrawerNav {data} />
	<TopNavbar {data} />
	<main class="grow p-6">
		{@render children()}
	</main>
</div>
