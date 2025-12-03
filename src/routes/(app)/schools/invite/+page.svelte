<script lang="ts">
	/** @type {{ data: PageData }} */
	import { page } from '$app/state';
	import InviteUserByEmailForm from '$lib/components/forms/super-invite-user-by-email-form.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	import Dialog from '$lib/components/dialog.svelte';
	import HtmlEmailUserInviteForm from '$lib/components/forms/html-email-user-invite-form.svelte';

	let { data } = $props();
	const { unusedAdminUserInvite, canEditForm } = data;

	$effect(() => {
		globals.setPageName('Invite Administrator');
	});

	let pageIsEditing = $state(false);
</script>

<svelte:head>
	<title>Invite Administrator</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<h1 class="sr-only">Invite Administrator</h1>
<div class="grid h-full place-content-center">
	<!-- <pre class="">{JSON.stringify(pageIsEditing, null, 2)}</pre> -->
	<Card.Root class="m-6 lg:lg:w-[65ch]">
		<Card.Content>
			{#if canEditForm}
				<HtmlEmailUserInviteForm
					bind:formisEditing={pageIsEditing}
					{unusedAdminUserInvite}
					{page}
					{data}
					{canEditForm}
				/>
				{#if !pageIsEditing}
					<InviteUserByEmailForm {data} {unusedAdminUserInvite} {page} {canEditForm} />
				{/if}
			{:else}
				<InviteUserByEmailForm {data} {unusedAdminUserInvite} {page} {canEditForm} />
			{/if}
		</Card.Content>
	</Card.Root>
</div>
