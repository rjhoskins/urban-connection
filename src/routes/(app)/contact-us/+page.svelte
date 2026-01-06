<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Mail } from 'lucide-svelte';
	import { getGlobalsContext } from '$lib/store/globals-state.svelte';
	const globals = getGlobalsContext();

	let pageTitle = $state('Contact Us');
	$effect(() => {
		globals.setPageName(pageTitle);
	});

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const email = 'cantact@urbanconnection.org';
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>
<h1 class="sr-only">Contact Us</h1>

<section class="grid h-full place-items-center text-[#1F2937]">
	<Card class="p-8 lg:lg:w-[65ch]">
		<h2 class="text-center text-2xl text-[#1F2937]">Contact Us</h2>
		<p class="mt-2 mb-8 text-center text-[#4B5563]">Get in touch with our team</p>
		<a href="mailto:{email}">
			<Card class="flex items-center gap-4 p-6 hover:bg-[#E5E7EB]/10">
				<div class="grid h-10 w-10 place-items-center rounded-full bg-[#E5E7EB]">
					<Mail class="fill-black stroke-white" />
				</div>
				<div class="flex flex-col gap-1">
					<p>Email</p>
					<p class="text-sm text-[#4B5563]">{email}</p>
				</div>
			</Card>
		</a>
	</Card>
</section>
