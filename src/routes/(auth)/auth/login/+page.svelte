<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { enhance } from '$app/forms';
	import LoginForm from '$lib/components/forms/login-form.svelte';

	let { data } = $props();
</script>

<section class="grid-cols-golden-cols grid h-screen overflow-hidden">
	<div class="col-start-2 grid place-content-center bg-[#cac2e6] lg:col-start-1">
		<LoginForm {data} />
	</div>

	<img
		class="col-start-1 row-start-1 h-full w-full object-cover lg:col-start-2 2xl:object-fill"
		alt="city with school"
		src="/img/city-with-school.png"
	/>
</section>
