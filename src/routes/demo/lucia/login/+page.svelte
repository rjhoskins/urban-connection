<script lang="ts">
	import { enhance } from '$app/forms';
	import LoginOrRegisterForm from '$lib/components/forms/login-or-register-form.svelte';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

	let { data, form } = $props();
</script>

<h1>TODO: Login/Register</h1>
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
<p style="color: red">{form?.message ?? ''}</p> -->
<LoginOrRegisterForm data={data.form!} />
