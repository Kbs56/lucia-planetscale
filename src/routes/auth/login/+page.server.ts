import { formSchema } from '$lib/schema';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { message, superValidate } from 'sveltekit-superforms/server';
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

		if (Object.keys(existingUser).length === 0) {
			return message(form, 'Incorrect username or password');
		}

		const validPassword = await new Argon2id().verify(existingUser[0].password, form.data.password);

		if (!validPassword) {
			return message(form, 'Incorrect username or password');
		}

		const session = await lucia.createSession(existingUser[0].id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
