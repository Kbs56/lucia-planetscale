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
import { superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	} else {
		return {
			form: await superValidate(formSchema)
		};
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		const data = formSchema.parse(formData);

		const existingUser = await db.select().from(user).where(eq(user.email, data.email));

		if (existingUser) {
			return fail(400, {
				message: 'Account with that email already exists.'
			});
		}

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
			return fail(500, {
				message: 'An unkown error occured'
			});
		}
		return redirect(302, '/');
	}
};
