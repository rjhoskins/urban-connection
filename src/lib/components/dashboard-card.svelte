<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let { title, relLinkurl, description, imgUrl, imgStyleDimensions } = $props();
</script>

<Card.Root class="w-72 rounded-md px-9 py-6 text-center">
	<a href={relLinkurl} class="flex flex-col items-center gap-4">
		<img src={imgUrl} alt={title} style={imgStyleDimensions} srcset="" />
		<!-- <icon />				 -->
		<p class="text-primary text-lg font-bold">{title}</p>
		<p class="text-sm text-[#757575]">{description}</p>
	</a>
</Card.Root>
