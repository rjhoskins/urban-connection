<script lang="ts">
	let { admin } = $props();
	const { adminName, adminEmail, adminPhone } = admin;
</script>

<p class="">Name: {adminName}</p>
<div class="flex gap-4">
	<p class="">Email: {adminEmail}</p>
	{#if adminPhone}
		<p class="">Phone: {adminPhone}</p>
	{/if}
</div>
<!-- <pre>{JSON.stringify(admin, null, 2)}</pre> -->
