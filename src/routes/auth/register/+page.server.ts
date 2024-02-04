import { formSchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { lucia } from '$lib/server/auth';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		try {
			const data = formSchema.parse(formData);
			console.log(data);

			const userId = generateId(15);
			const hashedPassword = await new Argon2id().hash(data.password);

			console.log(userId);
			console.log(hashedPassword);
			await db.insert(user).values({ id: userId, email: data.email, password: hashedPassword });
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			if (e instanceof z.ZodError) {
				console.log(e.flatten());
				return fail(400, {
					message: 'Validation Error',
					errors: e.flatten().fieldErrors
				});
			}
			// if (e instance of database error) {
			// handle here
			// }
			return fail(400, {
				message: 'Something went wrong',
				errors: {}
			});
		}
		return redirect(302, '/');
	}
};
