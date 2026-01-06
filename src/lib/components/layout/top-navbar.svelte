<script lang="ts">
	import { LayoutGrid, Settings, Headphones } from 'lucide-svelte';
	import SignOutAvaterButton from '../sign-out-avater-button.svelte';
	let { data } = $props();
	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Contact Us', href: '/contact-us' }
	];
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	let pageTitle = $state(globals.pageName);

	$effect(() => {
		pageTitle = globals.pageName;
	});
</script>

<nav class="flex items-center justify-between bg-white p-4">
	<div class="max-w-theme-max flex w-full items-center justify-between">
		<p class="text-2xl text-[#45464E] capitalize">
			{pageTitle || 'Climate Effectiveness Progress Monitoring Assessment'}
		</p>
		<SignOutAvaterButton text={'Logout'} />
	</div>
</nav>
