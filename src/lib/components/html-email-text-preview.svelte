<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	let { data, token = 'tbd' } = $props();
</script>

{#if data && browser}
	<Card.Header class="Header">
		<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
		<Card.Title>Invite Text Preview</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-3">
		<p>{data.greeting}</p>
		<p class="max-w-prose">
			{data.definition}
		</p>
		<ul class="list-inside list-disc">
			{#each data.keyPoints as keyPoint (keyPoint)}
				<li>{keyPoint}</li>
			{/each}
		</ul>
		<p>{data.closing}</p>

		<p>
			{data.callToAction}
			<a
				href={`${window.location.origin}/auth/register?inviteToken=${token}`}
				class=" text-lg text-blue-700 underline">{data.registrationLinkText}</a
			>
		</p>
	</Card.Content>
{/if}
