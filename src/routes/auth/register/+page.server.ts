import { formSchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		console.log(formData);

		try {
			const data = formSchema.parse(formData);
			console.log(data);
		} catch (e) {
			if (e instanceof z.ZodError) {
				console.log(e.flatten());
				return fail(400, {
					message: 'Validation Error',
					errors: e.flatten().fieldErrors
				});
			}
			return fail(400, {
				message: 'Something went wrong',
				errors: {}
			});
		}
		return {
			success: true
		};
	}
};
