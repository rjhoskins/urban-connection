<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.css';

	import { initFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';

	const flash = initFlash(page, {
		clearOnNavigate: true,
		clearAfterMs: 3000
		//   clearArray: false,
		//   flashCookieOptions: CookieSerializeOptions
	});
	$effect(() => {
		if ($flash) {
			toast[$flash.type]($flash.message);
		}
	});

	// const flash = getFlash(page);
	let { children, data } = $props();
</script>

<div class="relative flex h-full flex-col bg-[#FAFAFB]">
	{@render children()}

	<Toaster />
</div>
