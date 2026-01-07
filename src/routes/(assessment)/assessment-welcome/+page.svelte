<script lang="ts">
	import DemographicsForm from '$lib/components/forms/demographics-form.svelte';
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
<!-- http://localhost:5173/urban-connection-project-assessment?assessmentId=01KE3HDT5XMJGNSB6VJJDFK1KV-->

<DemographicsForm {demographicsFields} {assessmentInviteId} />
<pre class="hidden">{JSON.stringify(data, null, 2)}</pre>
