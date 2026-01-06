<script lang="ts">
	import { PlayIcon, RotateCwIcon, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '../components/ui/input/input.svelte';
	import { getModalStateContext } from '$lib/modal-state.svelte';
	import { logIfDev } from '$lib/utils';
	import { videoIdMap } from '$lib/constants';
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';

	const modal = getModalStateContext();
	// state enum

	let isOpen = $state(modal?.isResumeAssessmentOpen);

	function closeModal() {
		modal.isResumeAssessmentOpen = false;
		modal.handleModalVideoClose();
	}

	function handleOutSideClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains('modal')) {
			modal.handleModalVideoClose();
			closeModal();
		}
	}

	function handleStartNew() {
		//localhost:5173/assessment-welcome?assessmentInviteId=01KBDC76EXDZTG91PBQ20Z5G17
		closeModal();
		http: modal.handleManualVideoSelect(videoIdMap.get('modal-demographics')!);
	}
</script>

{#if modal.isResumeAssessmentOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- onclick={handleOutSideClick} -->
	<div class="modal fixed inset-0 z-60 flex items-center justify-center bg-black/50">
		<div class=" content relative max-w-2xl rounded-md bg-white px-8 py-12 shadow-lg">
			<h2 class="text-center text-3xl font-bold">Assessment</h2>
			{#if !modal.isResumeAssessmentResume}
				<small class="block text-center text-gray-600">What would you like to do?</small>
			{/if}

			<form
				use:enhance={({ formElement, formData, action, cancel, submitter }) => {
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							logIfDev('Resume assessment success', result);
							closeModal();
							toast.success('Success, picking up where you left off');
							modal.assessmentParticipantEmail = formData.get('email') as string;
							goto(result.location);
						} else {
							logIfDev('Resume assessment failed', result);
							toast.error('Error: email or assessment not found');
							await applyAction(result);
							closeModal();
						}
					};
				}}
				method="POST"
				action="?/resume"
				class="mt-4 flex flex-col gap-4"
			>
				{#if modal.isResumeAssessmentResume}
					<p class=" font-medium text-gray-600">Resume Previous Assessment</p>
					<Input
						type="email"
						name="email"
						placeholder="Enter same email"
						class=" rounded border p-2"
						required
					/>
					<div class="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onclick={() => {
								modal.isResumeAssessmentResume = false;
							}}
							class="w-fit">Back</Button
						>
						<Button type="submit" class="w-fit">
							<RotateCwIcon size={12} />
							Resume Previous</Button
						>
					</div>
				{:else}
					<div class="flex flex-col justify-end gap-4">
						<Button
							type="button"
							class="w-full py-4 text-xl"
							variant="outline"
							size="lg"
							onclick={() => {
								modal.isResumeAssessmentResume = true;
							}}
							><RotateCwIcon size={60} />
							Continue Previous</Button
						>
						<Button size="lg" type="button" onclick={() => handleStartNew()} class="w-full text-xl"
							><PlayIcon fill="currentColor" size={60} />

							Start New</Button
						>
					</div>
				{/if}
			</form>
		</div>
	</div>
{/if}
