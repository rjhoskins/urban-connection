<script lang="ts">
	/** @type {{ data: PageData }} */
	import { page } from '$app/state';
	import InviteUserByEmailForm from '$lib/components/forms/invite-user-by-email-form.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { decodeInviteToken, createInviteToken } from '$lib/utils';
	import Dialog from '$lib/components/dialog.svelte';
	import HtmlEmailUserInviteForm from '$lib/components/forms/html-email-user-invite-form.svelte';

	let { data } = $props();
	const { token } = data;
	const { name, email, inviteId } = decodeInviteToken(token || '');
	let pageHTMLEmail = $state();
	let pageIsEditing = $state(true);
</script>

<svelte:head>
	<title>Hello world!</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<h1 class="sr-only">Invite Administrator</h1>
<p class="hidden">Invite Token => {token || 'TODO'}</p>
<div class="grid h-full place-content-center">
	<!-- <pre class="sizes">{JSON.stringify(pageIsEditing, null, 2)}</pre> -->
	<Card.Root>
		<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
		<Card.Content class="max-w-2xl">
			<HtmlEmailUserInviteForm bind:formisEditing={pageIsEditing} {data} {token} {page} />
			{#if !pageIsEditing}
				<InviteUserByEmailForm {data} {token} {page} />
			{/if}
		</Card.Content>
	</Card.Root>
</div>
