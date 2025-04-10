<script lang="ts">
	let { admin } = $props();
	const { adminName, adminEmail, adminPhone } = admin;
</script>

<div class="flex flex-col gap-0.5 text-[#525252]">
	<p class="">{adminName}</p>
	<p class="">Email:{adminEmail}</p>
	{#if adminPhone}
		<p class="">Phone: {adminPhone}</p>
	{/if}
</div>
<!-- <pre>{JSON.stringify(admin, null, 2)}</pre> -->
