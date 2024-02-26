import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return {
			user: event.locals.user
		};
	} else {
		redirect(302, '/auth/register');
	}
};
