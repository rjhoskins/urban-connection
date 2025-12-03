<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { List, UserRoundPlus, Eye, Send } from 'lucide-svelte';
	import DashboardCard from './dashboard-card.svelte';
	const schoolAdminPanelAdminData = [
		{
			title: 'View Organization',
			linkurl: '/schools',
			description: 'View  organization & results by teacher.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		},
		{
			title: 'Invite Administrator',
			linkurl: '/schools?&view=invite',
			description: 'Send email invitation to administrator.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		}
		// {
		// 	title: 'Send Assessment Invitation',
		// 	linkurl: '/schools',
		// 	description: 'Access your assessment invitation link.',
		// 	imgUrl: '/img/person-gear.png',
		// 	imgStyleDimensions: 'height: 65px; width: 65px;'
		// },
		// {
		// 	title: 'View Assessment Results',
		// 	linkurl: '/schools?&view=results',
		// 	description: 'View completed Assessment Total results for the organization',
		// 	imgUrl: '/img/person-gear.png',
		// 	imgStyleDimensions: 'height: 65px; width: 65px;'
		// }
	];

	let { school } = $props();
</script>

<!-- <h1 class="sr-only">Manage {school.name} School</h1> -->
<div class="flex max-w-[920px] flex-wrap justify-center gap-6">
	{#each schoolAdminPanelAdminData as item (item.title)}
		<DashboardCard
			title={item.title}
			relLinkurl={item.linkurl}
			description={item.description}
			imgUrl={item.imgUrl}
			imgStyleDimensions={item.imgStyleDimensions}
		/>
	{/each}
</div>
