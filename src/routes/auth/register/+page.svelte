<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { formSchema } from '$lib/schema';

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
			<form class="flex flex-col gap-y-2" method="POST">
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

				<div class="flex w-full flex-row items-center justify-center gap-1.5 pt-4">
					<Button type="submit" class="w-full">Register</Button>
				</div>
				<div class="flex flex-col items-center justify-center">
					<Separator />
					<div class="flex w-full flex-row items-center justify-center gap-1.5 pt-2">
						<Button href="/auth/login/github" class="w-full">Continue with Github</Button>
					</div>
					<div class="flex w-full flex-row items-center justify-center gap-1 pt-2">
						<a class="text-sm" href="/auth/login"
							>Already have an account? <span class="underline">Login here.</span></a
						>
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
