<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<FormSchema>;
</script>

<div class="flex h-screen items-center justify-center">
	<Form.Root form={data} schema={formSchema} let:config method="POST" class="space-y-8">
		<Form.Item>
			<Form.Field {config} name="email">
				<Form.Label>Username</Form.Label>
				<Form.Input placeholder="user.example@gmail.com" />
				<Form.Description>Your email will act as the username for your account</Form.Description>
				<Form.Validation />
			</Form.Field>
		</Form.Item>
		<Form.Item>
			<Form.Field {config} name="password">
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" placeholder="password" />
				<Form.Description>This is your password</Form.Description>
				<Form.Validation />
			</Form.Field>
		</Form.Item>
		<Form.Button>Register</Form.Button>
	</Form.Root>
</div>
