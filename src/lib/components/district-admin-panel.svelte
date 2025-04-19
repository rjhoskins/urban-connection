<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { LayoutGrid, List, PenTool, Send, UserRoundPlus, Eye } from 'lucide-svelte';
	import DashboardCard from './dashboard-card.svelte';

	const adminData = [
		{
			title: 'View  Organization',
			linkurl: '/districts',
			description: 'View dashboard and manage district.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		},
		{
			title: 'Send Assessment Invitation',
			linkurl: '/districts',
			description: 'Navigate to a school to add an admin or access your assessment invite link.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		},
		{
			title: 'Invite School Admin Invitation',
			linkurl: '/districts',
			description: 'Navigate to a school to access your assessment invite link.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		},
		{
			title: 'View Assessment Results',
			linkurl: '/districts?&view=results',
			description: 'View assessment results for the your district.',
			imgUrl: '/img/person-gear.png',
			imgStyleDimensions: 'height: 65px; width: 65px;'
		}
	];

	let { district } = $props();
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
