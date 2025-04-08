<script>
	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	let { school, page, isNested = false } = $props();
	const { name, id, assessmentCount, pointsTotal, questionsTotal } = school;
	const totalAssessmentScorePercentage = Math.round((pointsTotal / questionsTotal) * 100) || 0;
	const tableHeaders = [
		{ name: 'School Name', class: '' },
		{ name: 'Total Assessments' },
		{ name: 'Total Score' },
		{ name: 'Action', class: 'text-right' }
	];
</script>

<Table.Row>
	<Table.Cell class="font-medium">
		{school.name}
	</Table.Cell>
	<Table.Cell>
		{school.assessmentCount}
	</Table.Cell>
	<Table.Cell>
		{Math.round((school.pointsTotal / school.questionsTotal) * 100) || 0}%
	</Table.Cell>
	<Table.Cell class="text-right">
		<Button
			href={isNested
				? `${page.url.pathname}/schools/${school.id}`
				: `${page.url.pathname}/${school.id}`}
			class=""
		>
			View School
		</Button>
	</Table.Cell>
</Table.Row>
