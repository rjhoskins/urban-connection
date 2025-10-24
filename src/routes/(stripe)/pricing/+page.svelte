<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function handleCheckout(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		const currUrl = window.location.href;
		console.log('Checkout button clicked');
		event.preventDefault();
		const response = await fetch('/api/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ success_url: currUrl }) //stripe name convention
		});
		const { url } = await response.json();
		window.location.href = url;
	}
</script>

<h1>Hello Buy, cool stuff</h1>
<form action="/api/create-checkout-session" method="POST">
	<button onclick={handleCheckout} type="submit" id="checkout-button">Checkout</button>
</form>
