<script lang="ts">
	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Login', href: '/demo/lucia' },
		{ name: 'Contact Us', href: '/contact-us' }
		// { name: 'District', href: '/districts' },
		// { name: 'School Admin', href: '/school' },
		// { name: 'School', href: '/school' }
	];
</script>

<header class="bg-secondary">
	<nav class="mx-auto flex max-w-7xl items-center gap-4 p-4">
		<p class="mr-auto text-3xl font-semibold">TUCP</p>
		{#each Links as link (link.name)}
			<a href={link.href}>{link.name}</a>
		{/each}
	</nav>
</header>
