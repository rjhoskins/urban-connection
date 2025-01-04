<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { page } from '$app/state';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];
	const Links = [
		{ name: 'Home', href: '/' },
		{ name: 'Login', href: '/auth/login' },
		{ name: 'Contact Us', href: '/contact-us' }
		// { name: 'District', href: '/districts' },
		// { name: 'School Admin', href: '/school' },
		// { name: 'School', href: '/school' }
	];

	import { users } from '$lib/store/users.svelte';
	$effect(() => {
		users.selectedUser = 'UC';
	});
</script>

<header class="bg-secondary">
	<p>Currently at {page.url.pathname}</p>
	<nav class="mx-auto flex max-w-7xl items-center gap-4 p-4">
		<p class="mr-auto text-3xl font-semibold">The Urban Connection Project</p>
		<div class="">hello,</div>
		{#if page.url.pathname === '/'}
			<div>
				<label for="users" class="sr-only block text-sm/6 font-medium text-gray-900">Hello, </label>
				<div class="grid grid-cols-1">
					<select
						id="location"
						name="users"
						bind:value={users.selectedUser}
						class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					>
						{#each users.users as user, i}
							<option value={users.users[i]} selected={user == users.users[i]}>{user}</option>
						{/each}
					</select>
					<svg
						class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
						viewBox="0 0 16 16"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							fill-rule="evenodd"
							d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		{/if}

		{#each Links as link (link.name)}
			<a href={link.href}>{link.name}</a>
		{/each}
	</nav>
</header>
