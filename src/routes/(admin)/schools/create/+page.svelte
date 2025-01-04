<script lang="ts">
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */

	import NewSchoolForm from '$lib/components/forms/new-school-form.svelte';
	let { data } = $props();
</script>

<h1 class="my-6 text-center text-3xl">UC Admin Create</h1>

<NewSchoolForm data={data.form} />
