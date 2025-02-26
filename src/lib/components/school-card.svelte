<script>
	import * as Card from '$lib/components/ui/card';
	import Progress from './ui/progress/progress.svelte';
	let { school, page, isNested = false } = $props();
	const { name, id } = school;
	let schoolProgess;
</script>

<Card.Root class="transition-shadow duration-300 ease-in-out hover:shadow-lg">
	<Card.Header>
		<Card.Title>{name}</Card.Title>
		<Card.Description class="flex gap-4 text-primary/50">
			Team Members{' '}
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center gap-3 p-4 ">
		<a
			class="inline-flex h-10 grow items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			href={isNested ? `${page.url.pathname}/schools/${id}` : `${page.url.pathname}/${id}`}
			>View School</a
		>
		<div class="flex grow flex-col gap-2">
			<p class="">Assessment Progress</p>
			<Progress barBgColor="bg-green-700" value={schoolProgess || Math.random() * 100} />
		</div>
	</Card.Content>
	<!-- <pre>{JSON.stringify(page.url, null, 2)}</pre> -->
</Card.Root>
