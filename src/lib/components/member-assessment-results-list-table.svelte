<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils';
	import MemberAssessmentResultsListTableRow from './member-assessment-results-list-table-row.svelte';

	let { members, page, showScore = false } = $props();
	let tableHeaders = $state(
		showScore
			? [
					{ name: 'Name', class: '', sortBy: 'name' },
					{ name: 'Completed ', sortBy: 'completed' },
					{ name: 'Score', sortBy: 'score' }
				]
			: [
					{ name: 'Name', class: '', sortBy: 'name' },
					{ name: 'Completed ', sortBy: 'completed' }
				]
	);
	let sortedMembers = $state(members.sort((a, b) => a.name.localeCompare(b.name)));
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			{#each tableHeaders as header (header.name)}
				<Table.Head class={cn(`${header.class} `)}>
					{header.name}
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each sortedMembers as member, idx (member.id)}
			<MemberAssessmentResultsListTableRow {page} {member} {idx} />
		{/each}
	</Table.Body>
</Table.Root>
