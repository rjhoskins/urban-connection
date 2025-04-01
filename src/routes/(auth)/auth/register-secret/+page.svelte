<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import RegisterForm from '$lib/components/forms/register-form.svelte';
	import { page } from '$app/state';
	import { decodeAdminUserInviteToken } from '$lib/utils.js';

	let { data } = $props();
	const { token } = data;
	const { name, email, inviteId } = decodeAdminUserInviteToken(token || '');
</script>

<h1 class="my-6 text-center text-3xl capitalize">Register to create an account</h1>

<div class=" grid h-full place-content-center">
	<RegisterForm {data} {token} />
</div>
