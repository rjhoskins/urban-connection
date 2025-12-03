<script lang="ts">
	/** @type {{ data: PageData }} */
	import { page } from '$app/state';
	import InviteUserByEmailForm from '$lib/components/forms/super-invite-user-by-email-form.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Dialog from '$lib/components/dialog.svelte';
	import HtmlEmailUserInviteForm from '$lib/components/forms/html-email-user-invite-form.svelte';

	let { data } = $props();
	const { token, canEditForm } = data;
	const { name, email, inviteId } = { name: 'hi', email: 'hi', inviteId: 'hi' };
	let pageHTMLEmail = $state();
	let pageIsEditing = $state(false);
</script>

<svelte:head>
	<title>Hello world!</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<!-- <pre>{JSON.stringify(data.htmlTemplateData.template, null, 2)}</pre> -->

<h1 class="sr-only">Invite Administrator</h1>

<div class="grid h-full place-content-center">
	<!-- <pre class="">{JSON.stringify(pageIsEditing, null, 2)}</pre> -->
	<Card.Root class="m-6 lg:lg:w-[65ch]">
		<Card.Content>
			{#if canEditForm}
				<HtmlEmailUserInviteForm
					bind:formisEditing={pageIsEditing}
					{token}
					{page}
					{data}
					{canEditForm}
				/>
				{#if !pageIsEditing}
					<InviteUserByEmailForm {data} {token} {page} {canEditForm} />
				{/if}
			{:else}
				<InviteUserByEmailForm {data} {token} {page} {canEditForm} />
			{/if}
		</Card.Content>
		<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
	</Card.Root>
</div>
