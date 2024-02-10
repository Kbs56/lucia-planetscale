import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email('This is not a valid email.'),
	password: z.string().min(8, { message: 'Your password must contain 8 or more characters.' })
});

export type FormSchema = typeof formSchema;
