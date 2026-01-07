<script lang="ts">
	import { page } from '$app/state';
	import InviteUserByEmailForm from '$lib/components/forms/super-invite-user-by-email-form.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();
	import HtmlEmailUserInviteForm from '$lib/components/forms/html-email-user-invite-form.svelte';

	let { data }: { data: PageData } = $props();
	const { unusedAdminUserInvite, canEditForm } = data;
	let pageIsEditing = $state(false);

	let pageTitle = $state('Invite First Administrator');

	$effect(() => {
		globals.setPageName(pageTitle);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<h1 class="sr-only">{pageTitle}</h1>
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
