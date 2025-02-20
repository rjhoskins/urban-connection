<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	let { data, page, token } = $props();
</script>

{#if data && browser}
	<Card.Header class="Header">
		<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
		<Card.Title>Invite Administrator Text Preview</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-3">
		<p>{data.template.greeting}</p>
		<p>
			{data.template.definition}
		</p>
		<ul class="list-inside list-disc">
			{#each data.template.keyPoints as keyPoint (keyPoint)}
				<li>{keyPoint}</li>
			{/each}
		</ul>
		<p>{data.template.closing}</p>

		<p>
			{data.template.callToAction}
			<a
				href={`${window.location.origin}/auth/register?inviteToken=${token}`}
				class=" text-lg text-blue-700 underline">{data.template.registrationLinkText}</a
			>
		</p>
	</Card.Content>
{/if}
