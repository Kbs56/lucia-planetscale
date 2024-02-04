import { z } from 'zod';

export const userFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'This field has to be filled.' })
		.email('This is not a valid email.')
		.refine((e) => e === 'An account with this email already exists.'),
	password: z.string().min(1, { message: 'This field has to be filled.' })
});

export type UserFormSchema = typeof userFormSchema;
