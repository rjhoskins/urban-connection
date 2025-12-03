<script lang="ts">
	/** @type {{ data: PageData }} */
	import * as Card from '$lib/components/ui/card';
	import GenericInviteForm from '$lib/components/forms/generic-invite-form.svelte';
	import HtmlEmailTextPreview from '$lib/components/html-email-text-preview.svelte';
	import { TEMPLATE_TITLES } from '$lib/constants.js';
	import { onMount } from 'svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	let { data } = $props();

	let formisEditing = $state(true);
	const templatTitle = TEMPLATE_TITLES[data.type!] || 'Template';

	onMount(() => {
		globals.setPageName(`HTML Email Templates | ${templatTitle}`);
	});
</script>

<svelte:head>
	<title>Hello world!</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<!-- <pre>{JSON.stringify(data.htmlTemplateData.template, null, 2)}</pre> -->

<h1 class="sr-only">Edit Template Content</h1>

<div class="grid h-full place-content-center">
	<Card.Root class="m-6 lg:lg:w-[65ch]">
		<Card.Content>
			{#if data.type === 'admin_invite' || data.type === 'assessment_invite'}
				<GenericInviteForm {data} />
			{:else}
				<p class="text-center">No template content found</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
