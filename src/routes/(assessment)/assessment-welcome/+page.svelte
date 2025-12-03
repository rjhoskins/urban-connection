<script lang="ts">
	import DemographicsForm from '$lib/components/forms/demographics-form.svelte';
	import { videoIdMap } from '$lib/constants';
	import { getModalStateContext } from '$lib/modal-state.svelte';

	import { onMount } from 'svelte';
	const modal = getModalStateContext();

	const { data } = $props();
	const { demographicsFields, assessmentInviteId } = data;

	onMount(() => {
		modal.isResumeAssessmentOpen = true;
	});
</script>

<!-- http://localhost:5173/assessment-welcome?assessmentInviteId=01KBDC76EXDZTG91PBQ20Z5G17 -->

<DemographicsForm {demographicsFields} {assessmentInviteId} />
<pre class="hidden">{JSON.stringify(data, null, 2)}</pre>
