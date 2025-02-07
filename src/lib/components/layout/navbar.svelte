<script lang="ts">
	let { data } = $props();
	import { page } from '$app/state';

	const Links = [
		{ name: 'testing', href: '/test' },
		// { name: 'wip quiz', href: '/urban-connection-project-assessment' },
		{ name: 'Home', href: '/' },
		{ name: 'Contact Us', href: '/contact-us' }
	];

	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
</script>

<header class="bg-secondary">
	<nav class="mx-auto flex max-w-7xl items-center gap-4 p-4">
		<p class="mr-auto text-3xl font-semibold">The Urban Connection Project</p>
		<div class="">
			{#if data?.user?.name}
				<p>
					hello, {data?.user?.name}
				</p>
			{:else}{/if}
		</div>

		{#each Links as link (link.name)}
			<a href={link.href}>{link.name}</a>
		{/each}
		{#if data?.user?.username}
			<form method="post" action="/auth?/logout" use:enhance>
				<Button type="submit">Logout</Button>
			</form>
		{:else}
			<a href="/auth/login"><Button>Login</Button></a>
		{/if}
	</nav>
</header>
