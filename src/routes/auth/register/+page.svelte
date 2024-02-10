<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { formSchema } from './schema';

	export let data: PageData;

	const { form, errors } = superForm(data.form, {
		validators: formSchema,
		resetForm: true
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="flex w-1/3 flex-col space-y-1">
		<Card.Header>
			<Card.Title class="text-2xl">Register Account.</Card.Title>
			<Card.Description>Register here to become a member.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="flex flex-col gap-y-4" method="POST">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="email"
						name="email"
						required
						bind:value={$form.email}
					/>
					{#if $errors.email}
						<span class="text-sm font-light text-red-600">{$errors.email}</span>
					{/if}
				</div>

				<div class="flex w-full flex-col gap-1.5">
					<Label for="password">Password</Label>
					<Input
						type="password"
						id="password"
						placeholder="password"
						name="password"
						required
						bind:value={$form.password}
					/>
					{#if $errors.password}
						<span class="text-sm font-light text-red-600">{$errors.password}</span>
					{/if}
				</div>

				<div class="flex w-full flex-row items-center justify-center gap-1.5">
					<Button type="submit">Register</Button>
				</div>

				{#if $form?.data?.message}
					hello
				{/if}
			</form>
		</Card.Content>
	</Card.Root>
</div>
