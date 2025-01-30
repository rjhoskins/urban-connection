<script lang="ts">
	/** @type {{ data: PageData }} */
	import { page } from '$app/state';
	import InviteUserByEmailForm from '$lib/components/forms/invite-user-by-email-form.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { decodeInviteToken, createInviteToken } from '$lib/utils';
	import Dialog from '$lib/components/dialog.svelte';

	let { data } = $props();
	const { token } = data;
	const { name, email, inviteId } = decodeInviteToken(token || '');
</script>

<svelte:head>
	<title>Hello world!</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<h1 class="sr-only">Invite Administrator</h1>
<p class="hidden">Invite Token => {token || 'TODO'}</p>
<div class="grid h-full place-content-center">
	<InviteUserByEmailForm {data} {token} {page} />
</div>

<Dialog />
