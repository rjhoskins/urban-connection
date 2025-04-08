<script lang="ts">
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';
	import Button from './ui/button/button.svelte';
	import { UserRound } from 'lucide-svelte';

	type Props = {
		text: string;
		class?: string;
	};

	let { text, class: className }: Props = $props();
</script>

<div class={cn('mb-auto flex justify-start gap-2 font-normal  text-white', className)}>
	<form class="" method="post" action="/auth?/logout" use:enhance>
		<Button type="submit" class={cn('mb-auto flex justify-start gap-2 font-normal  text-white')}>
			<span class="">{text}</span>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						opacity="0.4"
						d="M2.51758 6.50658C2.51758 4.14654 4.47248 2.22461 6.87421 2.22461H11.6512C14.048 2.22461 15.998 4.14076 15.998 6.49695V17.2004C15.998 19.5615 14.0431 21.4824 11.6404 21.4824H6.86539C4.46758 21.4824 2.51758 19.5663 2.51758 17.2101V16.305V6.50658Z"
						fill="white"
					/>
					<path
						d="M21.5631 11.3285L18.823 8.52745C18.5398 8.23858 18.084 8.23858 17.8017 8.52937C17.5204 8.82016 17.5213 9.28909 17.8036 9.57796L19.305 11.1118H17.8655H9.78654C9.38799 11.1118 9.06445 11.444 9.06445 11.8533C9.06445 12.2635 9.38799 12.5947 9.78654 12.5947H19.305L17.8036 14.1286C17.5213 14.4174 17.5204 14.8864 17.8017 15.1772C17.9433 15.3226 18.1281 15.3957 18.3137 15.3957C18.4976 15.3957 18.6823 15.3226 18.823 15.1791L21.5631 12.379C21.6991 12.2394 21.776 12.0507 21.776 11.8533C21.776 11.6568 21.6991 11.4681 21.5631 11.3285"
						fill="white"
					/>
				</svg>
			</svg>
		</Button>
	</form>

	<div class="grid place-items-center rounded-md bg-[#EFF2FE] p-2.5">
		<UserRound class=" text-primary h-4 w-4  bg-[#EFF2FE]" />
	</div>
</div>
