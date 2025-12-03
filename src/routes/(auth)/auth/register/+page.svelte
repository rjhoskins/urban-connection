<script lang="ts">
	import RegisterForm from '$lib/components/forms/register-form.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { adminInvite } = data;
	onMount(() => {
		console.log('Register Page data ===>', data);
	});
</script>

<h1 class="my-6 text-center text-3xl capitalize">Register to create an account</h1>

<!-- <pre class="">{JSON.stringify(data, null, 2)}</pre> -->

<div class=" grid h-full place-content-center">
	<RegisterForm {data} {adminInvite} />
</div>
