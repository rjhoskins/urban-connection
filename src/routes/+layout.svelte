<script lang="ts">
	import '../app.css';
	import toast, { Toaster } from 'svelte-french-toast';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { setGlobalsContext, getGlobalsContext } from '$lib/store/globals-state.svelte';
	setGlobalsContext();
	const globals = getGlobalsContext();

	const flash = getFlash(page);

	$effect(() => {
		if ($flash) {
			toast[$flash.type]($flash.message);
		}
	});

	let { children, data } = $props();
</script>

<div class="relative flex h-full flex-col bg-[#FAFAFB]">
	{@render children()}
	<Toaster />
</div>

<!-- "safelist hack" -->
<div class="hidden bg-[#B23532] bg-[#C9B53D] bg-[#CCFFBD] bg-[#F9F5D8] bg-[#FEF4F5]"></div>
