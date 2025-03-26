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

<section class="grid h-full">
	<div class="grid h-full place-content-center">
		<h1 class="py-4 pb-4 text-center text-3xl font-bold">Invite Co-Admin</h1>
		<div class="lg:grid-cols-golden-cols grid gap-6">
			<InviteCoAdminForm {data} {page} />
			<Card>
				<HtmlEmailTextPreview
					data={data.invitSchoolAdminHtmlTemplate?.template}
					token="tbd"
					disableLink
				/>
			</Card>
		</div>
	</div>
</section>
<!-- <pre class="max-w-prose">{JSON.stringify(data, null, 2)}</pre> -->
