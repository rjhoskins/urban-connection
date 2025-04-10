<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import Button from './ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	import { cn } from '$lib/utils';
	import MemberAssessmentResultsListTableRow from './member-assessment-results-list-table-row.svelte';
	import { onMount } from 'svelte';
	let { members, school, page, isNested = false } = $props();
	let sortedMembers = $state(members);

	let sortBy = $state('name');
	let sortDirection = $state('desc');

	const tableHeaders = [
		{ name: 'Name', class: '', sortBy: 'name' },
		{ name: 'School', sortBy: 'assessmentCount' },
		{ name: 'Completed ', sortBy: 'completed' },
		{ name: 'Score', sortBy: 'score' },
		{ name: 'Action', class: '[&>div]:!block [&>div]:!text-right' }
	];
	function handleTableHeaderClick(header: string) {
		sortBy = header;
		sortMembers();

		// sortMembers
	}

	function handleTableArrowClick() {
		sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

		// sortMembers
	}
	function sortMembers() {
		const newSortedMembers = members.toSorted((a, b) => {
			if (sortDirection === 'asc' && typeof a[sortBy] === 'string') {
				return a[sortBy].localeCompare(b[sortBy]);
			} else if (sortDirection === 'desc' && typeof a[sortBy] === 'string') {
				return b[sortBy].localeCompare(a[sortBy]);
			} else if (sortDirection === 'asc' && sortBy === 'score') {
				const totalAssessmentScorePercentageA =
					Math.round((a.pointsTotal / a.questionsTotal) * 100) || 0;
				const totalAssessmentScorePercentageB =
					Math.round((b.pointsTotal / b.questionsTotal) * 100) || 0;
				if (totalAssessmentScorePercentageA > totalAssessmentScorePercentageB) {
					return 1;
				} else if (totalAssessmentScorePercentageA < totalAssessmentScorePercentageB) {
					return -1;
				} else {
					return 0;
				}
			} else if (sortDirection === 'asc' && sortBy === 'completed') {
				return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
			} else if (sortDirection === 'desc' && sortBy === 'completed') {
				return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
			} else if (sortDirection === 'asc') {
				return a[sortBy] > b[sortBy] ? 1 : -1;
			} else {
				return a[sortBy] < b[sortBy] ? 1 : -1;
			}
		});
		sortedMembers = newSortedMembers;
	}

	$effect(() => {});
	onMount(() => {
		sortMembers();
	});
</script>

<Table.Root>
	<!-- <Table.Caption>A list of your recent invoices.</Table.Caption> -->
	<Table.Header>
		<Table.Row>
			{#each tableHeaders as header (header.name)}
				<Table.Head class={cn(`${header.class} `)}>
					<div class="flex items-center gap-4">
						{#if header.sortBy}
							<button onclick={() => handleTableHeaderClick(header.sortBy)}>{header.name}</button>
							<!-- svelte-ignore a11y_consider_explicit_label -->
							{#if header.sortBy === sortBy}
								<button
									onclick={handleTableArrowClick}
									class={` relative h-6 w-6 ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
								>
									<svg
										width="6"
										height="5"
										class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
										viewBox="0 0 6 5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g opacity="0.7">
											<path
												d="M2.4345 4.81539C2.4055 4.78714 2.2815 4.68047 2.1795 4.5811C1.538 3.99854 0.488 2.47881 0.1675 1.68339C0.116 1.56259 0.007 1.25718 0 1.09401C0 0.937652 0.036 0.788602 0.109 0.646371C0.211 0.46907 0.3715 0.326839 0.561 0.248904C0.6925 0.198734 1.086 0.120799 1.093 0.120799C1.5235 0.0428641 2.223 0 2.996 0C3.7325 0 4.4035 0.0428641 4.8405 0.106673C4.8475 0.11398 5.3365 0.191914 5.504 0.277155C5.81 0.433512 6 0.738919 6 1.06576V1.09401C5.9925 1.30687 5.8025 1.75451 5.7955 1.75451C5.4745 2.50706 4.476 3.99172 3.8125 4.58841C3.8125 4.58841 3.642 4.75645 3.5355 4.82952C3.3825 4.9435 3.193 5 3.0035 5C2.792 5 2.595 4.93619 2.4345 4.81539Z"
												fill="#030229"
											/>
										</g>
									</svg>
								</button>
							{/if}
						{:else}
							<p class="">{header.name}</p>
						{/if}
					</div>
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each sortedMembers as member, idx (member.id)}
			<MemberAssessmentResultsListTableRow {page} {member} {school} {idx} />
		{/each}
	</Table.Body>
</Table.Root>
