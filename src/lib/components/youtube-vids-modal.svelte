<script lang="ts">
	import { videoIdMap } from '$lib/constants';
	import { Video } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { getModalStateContext } from '$lib/modal-state.svelte';
	import { logIfDev } from '$lib/utils';
	const modal = getModalStateContext();

	function handleOutSideClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains('modal')) {
			modal.close();
			modal.clearVideoIds();
		}
	}
	function closeModal(event: MouseEvent) {
		modal.close();
		modal.clearVideoIds();
	}

	$effect(() => {
		logIfDev('modal state changed', {
			isOpen: modal.isOpen,
			buttonTitle: modal.buttonTitle,
			hideButton: modal.hideButton,
			videoId: modal.videoId,
			highestDomain: modal.highestDomain,
			highestSubDomain: modal.highestSubDomain
		});
	});
</script>

{#if modal.isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={handleOutSideClick}
	>
		<div class=" relative w-full max-w-5xl">
			<button class="absolute -top-8 right-0 text-white hover:text-gray-300" onclick={closeModal}>
				Close
			</button>
			<div class="aspect-video w-full">
				<!-- <iframe
					width="1024"
					height="576"
					title="YouTube video player"
					src="https://www.youtube.com/embed/5lFxJFX_cOU?autoplay=1&controls=1&rel=0"
					frameborder="0"
					allowfullscreen
				></iframe> -->

				{@html `<iframe class="h-full w-full" src="https://www.youtube.com/embed/${modal.videoId}?rel=0&autoplay=0&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}

				<!-- <iframe
					class="h-full w-full"
					src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=0&controls=1`}
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe> -->
			</div>
		</div>
	</div>
{/if}
<!-- class={`${initialEmbeddedId !== videoId ? 'inline-flex' : 'hidden'} bg-primary text-primary-foreground hover:bg-primary/90 text   h-10 w-fit items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0`} -->
<!-- class={` bg-primary text-primary-foreground hover:bg-primary/90 text inline-flex  h-10 w-fit items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0`} -->
