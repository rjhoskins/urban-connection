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
	const { name, email } = decodeInviteToken(token || '');
	let text = $state('');
</script>

<svelte:head>
	<title>Hello world!</title>
	<!-- <meta name="description" content="This is where the description goes for SEO" /> -->
</svelte:head>

<h1 class="sr-only">Invite School Administrator</h1>
<p class="hidden">Invite Token => {token || 'TODO'}</p>
<div class="grid h-full place-content-center">
	<div class="grid gap-6 lg:grid-cols-3">
		<div class="left lg:col-span-1">
			<InviteUserByEmailForm bind:inviteText={text} {data} {token} />
		</div>
		<div class="right h-full lg:col-span-2 lg:flex lg:flex-col">
			<h3 class="mb-2 text-xl">Email Text Preview</h3>
			<Card.Root class="h-full max-w-2xl">
				<Card.Header>
					<Card.Title></Card.Title>
				</Card.Header>
				<Card.Content class="space-y-3">
					<p>Dear Administrator,</p>
					<p>
						The Urban Connection Project defines Cultural Responsiveness as the bridge between
						people built by the infusion of cultural experiences necessary to:
					</p>
					<ul class="list-inside list-disc">
						<li>implement systems of accountability</li>
						<li>cultivate necessary relationships</li>
						<li>ensure content acquisition (education) We are happy to partner with you!</li>
					</ul>
					<p>{text}</p>

					<p>
						Please register to access your organization <a
							class=" text-lg text-blue-700 underline"
							href={`/auth/register?inviteToken=${createInviteToken(name, email)}`}>here</a
						>
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>

<Dialog />
