<script lang="ts">
	import { Button } from '../ui/button';

	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Login', href: '/demo/lucia' },
		{ name: 'Contact Us', href: '/contact-us' },
		{ name: 'Admin', href: '/admin' },
		{ name: 'District', href: '/district' },
		{ name: 'School Admin', href: '/school' },
		{ name: 'School', href: '/school' }
	];
</script>

<header class="bg-secondary">
	<nav class="flex items-center gap-4 p-4">
		<p class="mr-auto text-3xl font-semibold">TUCP</p>
		{#each Links as link (link.name)}
			<a href={link.href}>{link.name}</a>
		{/each}
	</nav>
</header>
