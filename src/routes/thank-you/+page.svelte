<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
</script>

<section class="grid place-items-center">
	<div class="mx-auto max-w-2xl">
		<h1 class="py py-8 text-center text-5xl font-bold">Thank You!</h1>
		<Card class="space-y-4 p-6">
			<h2>Thank you for taking the time to participate in the Assessment!</h2>
			<p>
				Your psrticipation is helping to bring positive change across schools in your area. Your
				results are being tabulated.
			</p>
		</Card>
	</div>
</section>
