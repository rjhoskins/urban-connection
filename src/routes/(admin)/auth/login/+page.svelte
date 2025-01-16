<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { enhance } from '$app/forms';
	import LoginOrRegisterForm from '$lib/components/forms/login-or-register-form.svelte';

	let { data } = $props();
</script>

<h1 class="sr-only">Login/Register</h1>

<!-- <form method="post" action="?/login" use:enhance>
	<label>
		Username
		<input name="username" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<button>Login</button>
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>

<hr class="my-6" /> -->

<div class="grid h-full place-items-center">
	<LoginOrRegisterForm {data} />
</div>
