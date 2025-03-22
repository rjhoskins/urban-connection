<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { page } from '$app/state';

	import InviteCoAdminForm from '$lib/components/forms/invite-co-admin-form.svelte';
	import HtmlEmailTextPreview from '$lib/components/html-email-text-preview.svelte';
	import { Card } from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="my-4">
	<h1 class="pb-4 text-center text-2xl font-bold">Invite Co-Admin</h1>
	<section class="md:grid-cols-golden-cols mx-auto h-full max-w-5xl gap-4 md:grid">
		<InviteCoAdminForm {data} {page} />
		<Card>
			<HtmlEmailTextPreview data={data.invitSchoolAdminHtmlTemplate?.template} token="tbd" />
		</Card>
	</section>
	<!-- <pre class="max-w-prose">{JSON.stringify(data, null, 2)}</pre> -->
</div>
