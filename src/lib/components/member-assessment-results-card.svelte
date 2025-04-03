<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	let { member, idx, school, isNested = false } = $props();
	const { id, name, email, pointsTotal, questionsTotal } = member;
	const progress = $derived.by(() => {
		if (pointsTotal && questionsTotal) {
			return (pointsTotal / questionsTotal) * 100;
		} else {
			return 0;
		}
	});
</script>

{#if browser}
	<Card.Root class="transition-shadow duration-300 ease-in-out hover:shadow-lg">
		<Card.Header>
			<Card.Title>{name ? name : `Teacher ${idx + 1}`}</Card.Title>
			<Card.Description class="text-primary/50 flex gap-4">{email ? email : null}</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				href={isNested
					? `${page.url.pathname}/assessments/${id}`
					: `${window.location.origin}/schools/${school.id}/assessments/${id}`}>View Results</a
			>
			<div class="flex grow flex-col gap-2">
				<div class="flex justify-between">
					<p>Total Assessment Score:</p>
					<p>{Math.round(progress)}%</p>
				</div>
				<Progress barBgColor="bg-green-700" value={progress} />
			</div>
		</Card.Content>
		<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
	</Card.Root>
{/if}
