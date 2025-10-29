<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import YoutubeVidsModal from '$lib/components/youtube-vids-modal.svelte';

	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	let name = $state('');

	import { setModalStateContext } from '$lib/modal-state.svelte';
	setModalStateContext();
	onMount(() => {
		name = globals.assessmentParticipantName;
	});

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<section class="">
	<div class="bg-white">
		<div class="max-w-theme-max mx-auto flex w-full items-center bg-white px-5 py-4">
			<img class=" w-11" src="/img/urban-connection-logo.png" alt="" />
			<p class=" text-xl text-[#45464E]">Urban Connection Project</p>
			{#if name}
				<p class="bg-primary ml-auto rounded-md px-1.5 py-0.5 text-sm font-normal text-white">
					{name}
				</p>
			{/if}
		</div>
	</div>
	{@render children?.()}
	<YoutubeVidsModal />
</section>
