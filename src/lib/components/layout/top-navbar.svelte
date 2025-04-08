<script lang="ts">
	import { LayoutGrid, Settings, Headphones } from 'lucide-svelte';
	let { data } = $props();
	import { page } from '$app/state';
	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Contact Us', href: '/contact-us' }
	];
	import { globals } from '../../store/globals.svelte';
	let pageTitle = $state(globals.pageName);
	let expanded = $state(false);
	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import SignOutAvaterButton from '../sign-out-avater-button.svelte';
	import { onMount } from 'svelte';
</script>

<nav class="flex items-center justify-between bg-white p-4">
	<div class="max-w-theme-max flex w-full items-center justify-between">
		<p class="text-2xl text-[#45464E]">
			{globals.pageName || 'The Urban Connection Project...'}
		</p>
		<SignOutAvaterButton text={'Admin'} />
	</div>
</nav>
