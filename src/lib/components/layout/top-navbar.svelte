<script lang="ts">
	import { LayoutGrid, Settings, Headphones } from 'lucide-svelte';
	let { data, pageTitle = 'Page Title' } = $props();
	import { page } from '$app/state';
	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Contact Us', href: '/contact-us' }
	];
	let expanded = $state(false);
	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import SignOutAvaterButton from '../sign-out-avater-button.svelte';
</script>

<div class="flex items-center justify-between bg-white p-4">
	<p>{pageTitle}</p>
	<SignOutAvaterButton text={'Admin'} />
</div>
