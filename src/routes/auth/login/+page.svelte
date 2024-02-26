<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { formSchema } from '$lib/schema';

	export let data: PageData;

	const { form, errors, message } = superForm(data.form, {
		validators: formSchema
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="flex w-1/3 flex-col space-y-1">
		<Card.Header>
			<Card.Title class="text-2xl">Login.</Card.Title>
			<Card.Description>Welcome Back.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="flex flex-col gap-y-2" method="POST">
				<div class="flex w-full flex-col gap-1.5">
					{#if $message}
						<span class="text-sm font-light text-red-600">{$message}</span>
					{/if}
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="youremail@email.com"
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

				<div class="flex w-full flex-row items-center justify-center gap-1.5 pt-4">
					<Button type="submit">Login</Button>
				</div>
				<div class="flex flex-col items-center justify-center">
					<small>Or</small>
					<a href="/auth/login/github">Login with Github</a>
				</div>
				<div class="flex w-full flex-row items-center justify-center gap-1">
					<a class="text-sm" href="/auth/register"
						>Need an account? <span class="underline">Register here.</span></a
					>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
