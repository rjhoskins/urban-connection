<script lang="ts">
	import { getModalStateContext } from '$lib/modal-state.svelte';
	const modal = getModalStateContext();

	let currVidShown = $derived(
		modal.ytIsManualVid ? modal.manualSetVideoId : modal.currYTModalVideoId
	);

	function handleOutSideClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains('modal')) {
			modal.handleModalVideoClose();
		}
	}

	function closeModal() {
		modal.handleModalVideoClose();
	}
</script>

{#if modal.ytModalIsOpen}
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

				{@html `<iframe class="h-full w-full" src="https://www.youtube.com/embed/${currVidShown}?rel=0&autoplay=0&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}

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
