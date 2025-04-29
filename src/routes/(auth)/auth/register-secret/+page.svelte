<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

	let { data } = $props();
</script>

<h1 class="my-6 text-center text-3xl capitalize">Register to create an account</h1>

<div class=" grid h-full place-content-center">
	<form method="POST" class="flex flex-col gap-4 rounded-md border-2 border-gray-300 p-4">
		<label for="username">username</label>
		<input type="username" name="username" />
		<label for="password">password</label>
		<input type="password" name="password" />
		<button type="submit">Submit</button>
	</form>
</div>
