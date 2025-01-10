<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import RegisterForm from '$lib/components/forms/register-form.svelte';
	import { page } from '$app/state';

	let { data } = $props();
	const { token } = data;
</script>

<h1 class="my-6 text-center text-3xl">Register Token => {token || 'TODO'}</h1>

<!-- <form method="post" action="?/register" use:enhance>
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

<RegisterForm {data} {token} />
<!-- <pre>{JSON.stringify(form, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(page, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
