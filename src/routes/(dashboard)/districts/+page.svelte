<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	interface District {
		id: number;
		name: string;
		memberSchoolsCount: number;
		pointsTotal: number;
		questionsTotal: number;
	}

	const { data }: { data: PageData } = $props();
	const { districtsData } = data as {
		districtsData: District[];
	};
</script>

<h1 class="my-6 text-center text-3xl">Manage All Districts</h1>
<section class=" grid-cols-four-fluid container grid max-w-6xl gap-4 py-8">
	{#each districtsData as district (district.id)}
		{@render districtCard(district)}
	{/each}
</section>

{#snippet districtCard(district: any)}
	<Card.Root
		class={[
			district.memberSchoolsCount === 0 ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
			'transition-shadow duration-300 hover:shadow-lg'
		]}
	>
		<Card.Header>
			<Card.Title>{district.name}</Card.Title>
			<Card.Description class={[district.memberSchoolsCount === 0 ? 'text-red-700' : '']}>
				Schools {district.memberSchoolsCount}
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center gap-3 p-4 ">
			<a
				class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 grow items-center justify-center rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
				href={`${page.url.pathname}/${district.id}`}>View District</a
			>
			{#if district.questionsTotal && district.pointsTotal}
				<div class="flex grow flex-col gap-2">
					<div class="flex justify-between">
						<p>Total Score:</p>
						<p>{Math.round((district.pointsTotal / district.questionsTotal) * 100)}%</p>
					</div>
					<Progress
						barBgColor="bg-green-700"
						value={(district.pointsTotal / district.questionsTotal) * 100}
					/>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
