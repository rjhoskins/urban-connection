<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import { page } from '$app/state';
	import { initFlash } from 'sveltekit-flash-message';

	const flash = initFlash(page, {
		clearAfterMs: 5000
	});
	$effect(() => {
		if ($flash) {
			toast[$flash.type]($flash.message);
		}
	});

	// const flash = getFlash(page);
	let { children, data } = $props();
</script>

<div class="relative flex h-full flex-col">
	<div
		class="absolute top-0 z-[-2] h-screen w-full bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"
	></div>
	<Navbar {data} />
	<main class="grow">
		{@render children()}
	</main>
	<Footer />
	<Toaster />
</div>
