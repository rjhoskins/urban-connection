<script lang="ts">
	import type { LayoutProps } from './$types';
	import { setModalStateContext, getModalStateContext } from '$lib/modal-state.svelte';
	setModalStateContext();
	const modalState = getModalStateContext();

	import ResumeAssessmentModal from '$lib/components/resume-assessment-modal.svelte';
	import YoutubeVidsModal from '$lib/components/youtube-vids-modal.svelte';

	let { data, children }: LayoutProps = $props();
</script>

<section class="">
	<div class="bg-white">
		<div class="max-w-theme-max mx-auto flex w-full items-center bg-white px-5 py-4">
			<img class=" w-11" src="/img/urban-connection-logo.png" alt="" />
			<p class=" text-xl text-[#45464E]">Climate Effectiveness Progress Monitoring Assessment</p>
			{#if modalState.assessmentParticipantEmail}
				<p class="bg-primary ml-auto rounded-md px-1.5 py-0.5 text-sm font-normal text-white">
					{modalState.assessmentParticipantEmail}
				</p>
			{/if}
		</div>
	</div>
	<div class="mx-auto max-w-7xl space-y-5 p-2 lg:p-8">
		<h1 class="text-3xl">Culturally Responsive teaching Progress Monitoring Assessment</h1>
		{@render children?.()}
	</div>
</section>
<ResumeAssessmentModal />
<YoutubeVidsModal />
