<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { page } from '$app/state';
	import InviteCoAdminForm from '$lib/components/forms/invite-co-admin-form.svelte';
	import HtmlEmailTextPreview from '$lib/components/html-email-text-preview.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	let pageTitle = $state('Climate Effectiveness Progress Monitoring Assessment Invite Co-Admin');

	let { data } = $props();

	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<section class="grid h-full place-items-center">
	<h1 class="sr-only">Invite Co-Admin</h1>
	<div class="md:grid-cols-golden-cols mx-auto max-w-5xl gap-4 md:grid">
		<InviteCoAdminForm {data} {page} />
		<Card>
			<HtmlEmailTextPreview data={data.schoolAdminHtmlTemplate?.template} disableLink />
		</Card>
	</div>
	<!-- <pre class="max-w-prose">{JSON.stringify(data, null, 2)}</pre> -->
</section>
