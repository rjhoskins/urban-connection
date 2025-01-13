<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { inviteNewUserSchema } from '$lib/schema.js';
	import { decodeInviteToken } from '$lib/utils';
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, token } = $props();
	const { name, email } = decodeInviteToken(token);
	const form = superForm(data.form, {
		validators: zodClient(inviteNewUserSchema)
	});
	const { form: formData, enhance, message } = form;
	$effect(() => {
		$formData.name = name;
		$formData.email = email;
	});
</script>

<Card.Root class="">
	<Card.Header>
		<Card.Title>Invite Administrator</Card.Title>
	</Card.Header>
	<Card.Content>
		<form class="flex flex-col gap-3" method="POST" use:enhance>
			<!-- name -->
			<Field {form} name="name">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							hidden={true}
							type="hidden"
							name="name"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							bind:value={$formData.name}
						/>
					{/snippet}
				</Control>
			</Field>

			<!-- email -->
			<Field {form} name="email">
				<Control>
					{#snippet children({ props }: { props: any })}
						<input
							{...props}
							hidden
							type="hidden"
							name="email"
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Control>
			</Field>

			<div class="flex gap-4">
				<Button class="grow" type="submit" variant="default">Send Invite</Button>
			</div>
			<SuperDebug data={$formData} />
			{#if $message}
				<div class="">{$message}</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>
