<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { enhance } from '$app/forms';
	import LoginForm from '$lib/components/forms/login-form.svelte';

	let { data } = $props();
</script>

<h1 class="sr-only">Login</h1>

<div class="grid h-full place-items-center">
	<LoginForm {data} />
</div>
