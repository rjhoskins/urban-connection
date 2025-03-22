<script lang="ts">
	/** @type {{ data: PageData }} */
	import * as Card from '$lib/components/ui/card';
	import { decodeAdminUserInviteToken, createAdminUserInviteToken } from '$lib/utils';
	import Dialog from '$lib/components/dialog.svelte';
	import SendAssessmentForm from '$lib/components/forms/send-assessment-form.svelte';
	import HtmlEmailTextPreview from '$lib/components/html-email-text-preview.svelte';

	let { data } = $props();
	let text = $state('');
</script>

<svelte:head>
	<title>Send Assessment</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<div class="my-4">
	<h1 class="pb-4 text-center text-2xl font-bold">Send Assessment</h1>

	<section class="md:grid-cols-golden-cols mx-auto h-full max-w-5xl gap-4 md:grid">
		<SendAssessmentForm bind:inviteText={text} {data} />
		<Card.Root>
			<HtmlEmailTextPreview data={data.assessmentInviteHtmlTemplate?.template} token="tbd" />
		</Card.Root>
	</section>
	<!-- <pre class="max-w-prose">{JSON.stringify(data, null, 2)}</pre> -->
</div>
