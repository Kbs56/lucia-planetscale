import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return {
			user: event.locals.user
		};
	} else {
		redirect(302, '/auth/register');
	}
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/auth/login');
	}
};
