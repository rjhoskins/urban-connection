<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import Button from './ui/button/button.svelte';
	import { getScoreBackgroundColor } from '$lib/utils';

	const isNested = page.url.pathname.includes('districts');
	let { member, idx, school } = $props();
	const { id, name, completedAt, pointsTotal, questionsTotal } = member;
	const progress = $derived.by(() => {
		if (pointsTotal && questionsTotal) {
			return (pointsTotal / questionsTotal) * 100;
		} else {
			return 0;
		}
	});

	const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

{#if browser}
	<Card.Root
		class="flex flex-col gap-6 px-5 py-2.5 transition-shadow duration-300 ease-in-out hover:shadow-lg	"
	>
		<div class="top flex justify-between">
			<div class="flex flex-col gap-1">
				<p class="text-sm">{isNested ? name : `Teacher ${idx + 1}`}</p>

				<p class="text-[11px] text-black/70">{school.name}</p>
			</div>

			<Button href={isNested ? `${page.url.pathname}/schools/${id}` : `${page.url.pathname}/${id}`}
				>View School</Button
			>
		</div>
		<div class="bottom flex justify-between text-xs text-black/70">
			<div class="flex flex-col gap-2">
				<p>Completed:</p>
				<p>Score:</p>
			</div>
			<div class="flex flex-col gap-2">
				<p>{formattedDate}</p>
				<p
					class={`md grid w-fit place-content-center rounded-md p-1 font-bold ${getScoreBackgroundColor(progress)}`}
				>
					{Math.round(progress)}%
				</p>
			</div>
		</div>

		<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
	</Card.Root>
{/if}
