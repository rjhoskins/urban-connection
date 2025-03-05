<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { enhance } from '$app/forms';
	import LoginOrRegisterForm from '$lib/components/forms/login-or-register-form.svelte';

	let { data } = $props();
</script>

<h1 class="sr-only">Login/Register</h1>

<div class="grid h-full place-items-center">
	<LoginOrRegisterForm {data} />
</div>
