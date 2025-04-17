<script lang="ts">
	import DashboardCard from './dashboard-card.svelte';

	const adminData = [
		{
			title: 'Create School',
			linkurl: '/create-school',
			description: 'Create school and send email invitation to administrator.',
			imgUrl: '/img/school.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		},
		{
			title: 'Manage Districts',
			linkurl: '/districts',
			description: 'View the details for all districts',
			imgUrl: '/img/districts.png',
			imgStyleDimensions: 'height: 60px; width: 60px;'
		},
		{
			title: 'Manage Schools',
			linkurl: '/schools',
			description: 'Manage the details for all schools',
			imgUrl: '/img/schools.png',
			imgStyleDimensions: 'height: 60px; width: 60px;'
		},
		{
			title: 'View Results Dashboard',
			linkurl: '/results',
			description: 'View completed assessment results for all schools',
			imgUrl: '/img/results.png',
			imgStyleDimensions: 'height: 60px; width: 60px;'
		},
		{
			title: 'Edit HTML Email Template text',
			linkurl: '/templates',
			description: 'Edit the text for the email template',
			imgUrl: '/img/html-email.png',
			imgStyleDimensions: 'height: 60px; width: 60px;'
		}
	];
</script>

<div class="flex max-w-[920px] flex-wrap justify-center gap-6">
	{#each adminData as item (item.title)}
		<DashboardCard
			title={item.title}
			relLinkurl={item.linkurl}
			description={item.description}
			imgUrl={item.imgUrl}
			imgStyleDimensions={item.imgStyleDimensions}
		/>
	{/each}
</div>
