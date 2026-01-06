<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Payment Success</title>
</svelte:head>
</script>

<h1>Hello Success</h1>
<p>Thank you for your purchase!</p>
<p>Your order has been successfully processed.</p>
<p>If you have any questions, please contact support.</p>
<p>We appreciate your business!</p>
<p><a href="/">Return to Home</a></p>
<p><a href="/orders">View Your Orders</a></p>
<p><a href="/profile">Go to Your Profile</a></p>
