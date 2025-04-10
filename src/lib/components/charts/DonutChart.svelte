<script lang="ts">
	import { onMount } from 'svelte';

	import * as d3 from 'd3';

	let {
		total,
		data
	}: {
		total: number;
		data: { category: string; value: number }[];
	} = $props();

	let vis: HTMLElement;

	// Set dimensions
	let width = $state(220);
	let height = $state(220);
	let margin = $state(20);
	let bgCircleMargin = $state(20);
	let radius = $derived(Math.min(width, height) / 2 - margin);
	let bgRadius = $derived(Math.min(width, height) / 2 - margin);
	onMount(() => {
		// Create SVG
		const svgContainer = d3
			.select('#chart')
			.append('svg')
			.attr('class', 'svgContainer')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		// Create background donut
		svgContainer
			.append('circle')
			.attr('r', bgRadius * 0.8)
			.attr('fill', 'none')
			.attr('stroke', '#EFF2FE')
			.attr('stroke-width', '55');

		// if data draw chart
		if (data.length > 0) {
			// Build the arc for the bg
			const bgArc = d3
				.arc()
				.innerRadius(radius * 0.7) // This creates the donut hole
				.outerRadius(radius + bgCircleMargin);
			// Build the arc for the donut
			const arc = d3
				.arc()
				.innerRadius(radius * 0.7) // This creates the donut hole
				.outerRadius(radius);

			// Set color scale
			const color = d3
				.scaleOrdinal()
				.domain(data.map((d) => d.category))
				.range(data.map((d) => d.chartColor));

			// Compute the position of each group on the pie
			const pie = d3
				.pie()
				.value((d) => d.value)
				.sort(null);

			// Build the arcs
			svgContainer
				.selectAll('path')
				.data(pie(data))
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('fill', (d) => color(d.data.category))
				.attr('stroke', 'white')
				.style('stroke-width', '2px')
				.style('opacity', 0.7)
				.on('mouseover', function () {
					d3.select(this).style('opacity', 1);
				})
				.on('mouseout', function () {
					d3.select(this).style('opacity', 0.7);
				});
		}
	});
</script>

<div class="relative mx-auto w-fit" bind:this={vis} id="chart">
	<p
		class="font-display absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-black"
	>
		{Math.round(total)}%
	</p>
</div>
