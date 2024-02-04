import { formSchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { DatabaseError } from '@planetscale/database';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		const data = formSchema.parse(formData);

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(data.password);

		try {
			await db.insert(user).values({ id: userId, email: data.email, password: hashedPassword });
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			if (e instanceof DatabaseError && e.body.message.includes('AlreadyExists')) {
				return fail(400, {
					message: 'Account with that email already exists'
				});
			}
			return fail(500, {
				message: 'An unkown error occured'
			});
		}
		return redirect(302, '/');
	}
};
