<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { page } from '$app/state';

	import InviteCoAdminForm from '$lib/components/forms/invite-co-admin-form.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>The Urban Connection Project</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<div class="grid h-full place-content-center">
	<InviteCoAdminForm {data} {page} />
</div>
