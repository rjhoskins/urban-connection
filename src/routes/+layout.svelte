<script lang="ts">
	import '../app.css';
	import toast, { Toaster } from 'svelte-french-toast';
	import { initFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { setGlobalsContext, getGlobalsContext } from '$lib/store/globals-state.svelte';
	setGlobalsContext();
	const globals = getGlobalsContext();
	import { onMount } from 'svelte';

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
	beforeNavigate(() => {
		console.log('beforeNavigate');
		globals.setLoading(true);
	});
	afterNavigate(() => {
		console.log('afterNavigate');
		globals.setLoading(false);
	});
	onMount(() => {});

	// const flash = getFlash(page);
	let { children, data } = $props();
</script>

<div class="relative flex h-full flex-col bg-[#FAFAFB]">
	<!-- {#if globals.isLoading || globals.isFetching}
		<div class="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-white">
			<div
				class="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-solid border-[#B23532] border-t-transparent"
			>
				<p>loading...</p>
			</div>
		</div> 
	{:else}{/if} -->
	{@render children()}

	<Toaster />
</div>

<!-- "safelist hack" -->
<div class="hidden bg-[#B23532] bg-[#C9B53D] bg-[#CCFFBD] bg-[#F9F5D8] bg-[#FEF4F5]"></div>
