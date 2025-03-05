<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Results</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
