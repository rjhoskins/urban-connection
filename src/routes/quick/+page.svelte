<script lang="ts">
	import KitchenSink from '$lib/components/forms/kitchen-sink.svelte';

	let { data } = $props();
</script>

<KitchenSink {data} />
