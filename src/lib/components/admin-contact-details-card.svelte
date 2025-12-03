<script lang="ts">
	import { Mail, Phone } from 'lucide-svelte';

	let { admin } = $props();
	const {
		id,
		user: { name, username, phone } // username is email-based
	} = admin;
</script>

<div class="flex flex-col gap-0.5 text-[#525252]">
	<p class="">{name}</p>
	<p class="flex items-center gap-1"><Mail size={12} />{username}</p>
	{#if phone}
		<p class="flex items-center gap-1"><Phone size={12} />{phone}</p>
	{/if}
</div>
