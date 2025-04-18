<script lang="ts">
	import Card from './ui/card/card.svelte';
	type Props = {
		posIndex: number;
		currDomain: number;
		name: string;
		imgUrl: string;
	};
	let { posIndex, imgUrl, currDomain, name }: Props = $props();

	const domainStatus = $derived.by(() => {
		if (posIndex < currDomain) return 'completed';
		if (posIndex === currDomain) return 'in-progress';
		if (posIndex > currDomain) return 'not-started';
		return '';
	});
</script>

<Card
	class={`${domainStatus == 'completed' ? 'bg-[#371E98]' : domainStatus == 'in-progress' ? 'bg-[#EFF2FE]' : ''} flex flex-col gap-1 px-7 py-4 text-left `}
>
	<img src={imgUrl} alt={`${name} progress indicator icon`} class="h-8 w-8" srcset="" />
	<p
		class={`${domainStatus == 'completed' ? 'text-white' : domainStatus == 'in-progress' ? 'text-[#371E98]' : ''} text-lg `}
	>
		{name}
	</p>
	<div class="text-sm">
		{#if domainStatus === 'completed'}
			<p class="text-white">Completed</p>
		{:else if domainStatus === 'in-progress'}
			<p class="">In Progress</p>
		{:else if domainStatus === 'not-started'}
			<p class="">Coming up</p>
		{:else}
			<p>no clue</p>
		{/if}
	</div>
</Card>
