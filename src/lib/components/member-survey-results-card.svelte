<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	import { page } from '$app/state';

	let { member, idx } = $props();
	const { id, name, email, pointsTotal, questionsTotal } = member;
	const progress = $derived.by(() => {
		if (pointsTotal && questionsTotal) {
			return (pointsTotal / questionsTotal) * 100;
		} else {
			return 0;
		}
	});
</script>

<Card.Root class="transition-shadow duration-300 ease-in-out hover:shadow-lg">
	<Card.Header>
		<Card.Title>Teacher {idx + 1}</Card.Title>
		<Card.Description class="flex gap-4 text-primary/50"></Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-3 p-4 ">
		<a
			class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			href={`${page.url.pathname}/surveys/${id}`}>View Results</a
		>
		<div class="flex grow flex-col gap-2">
			<div class="flex justify-between">
				<p>Total Assessment Score:</p>
				<p>{Math.floor(progress)}%</p>
			</div>
			<Progress barBgColor="bg-green-700" value={progress} />
		</div>
	</Card.Content>
	<!-- <pre>{JSON.stringify(page.url, null, 2)}</pre> -->
</Card.Root>
