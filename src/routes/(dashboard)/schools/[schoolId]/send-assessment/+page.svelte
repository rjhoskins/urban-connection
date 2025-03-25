<script lang="ts">
	/** @type {{ data: PageData }} */
	import * as Card from '$lib/components/ui/card';
	import { decodeAdminUserInviteToken, createAdminUserInviteToken } from '$lib/utils';
	import Dialog from '$lib/components/dialog.svelte';
	import SendAssessmentForm from '$lib/components/forms/send-assessment-form.svelte';
	import HtmlEmailTextPreview from '$lib/components/html-email-text-preview.svelte';

	let { data } = $props();
	// const { token } = data;
	// const  { name, email, inviteId } = decodeAdminUserInviteToken(token || '');
	let text = $state('');
	let token;
</script>

<svelte:head>
	<title>Send Assessment</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<section class="h-full">
	<h1 class="sr-only">Send Assessment</h1>

	<div class="grid h-full place-content-center">
		<div class="lg:grid-cols-golden-cols grid gap-6">
			<SendAssessmentForm {data} />
			<Card.Root>
				<HtmlEmailTextPreview data={data.assessmentInviteHtmlTemplate?.template} disableLink />
			</Card.Root>
		</div>
	</div>
</section>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
