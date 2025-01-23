<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	import RichTextEditor from '$lib/components/rich-text-editor.svelte';
</script>

<section class="mx-auto max-w-7xl p-2 lg:p-8">
	<Card class="">
		<RichTextEditor {data} />
	</Card>
	<!-- <pre class="">{JSON.stringify(editor, null, 2)}</pre> -->
</section>
