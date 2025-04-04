<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<section class="">
	<div class="bg-white">
		<div class="max-w-theme-max mx-auto flex w-full items-center bg-white px-5 py-4">
			<img class=" w-11" src="/img/urban-connection-logo.png" alt="" />
			<p class=" text-xl text-[#45464E]">Urban Connection Project</p>
			<p class=" ml-auto rounded-md bg-[#371E98] px-1.5 py-0.5 text-sm font-normal text-white">
				{data.tokenParseRes.name}
			</p>
		</div>
	</div>
	{@render children?.()}
</section>
