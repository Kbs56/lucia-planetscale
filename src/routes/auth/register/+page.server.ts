import { formSchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	} else {
		const form = await superValidate(event, formSchema);
		return {
			form
		};
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const existingUser = await db.select().from(user).where(eq(user.email, form.data.email));

		if (Object.keys(existingUser).length != 0) {
			console.log(typeof existingUser);
			console.log(existingUser);
			return setError(form, 'email', 'Email address already exists');
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(form.data.password);

		try {
			await db
				.insert(user)
				.values({ id: userId, email: form.data.email, password: hashedPassword });
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			return fail(500, {
				message: 'An unkown error occured'
			});
		}
		return redirect(302, '/');
	}
};
