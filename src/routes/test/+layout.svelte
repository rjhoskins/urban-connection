<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="">
	<div
		class="absolute top-0 z-[-2] h-[90vh] w-full bg-white bg-[linear-gradient(to_bottom,rgba(172,203,238,1)_0%,rgba(172,203,238,0)_100%)]"
	></div>
	{@render children?.()}
</div>
