import { Lucia } from 'lucia';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db/db';
import { session, user } from './db/schema';
import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

const adapter = new DrizzleMySQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (data) => {
		return {
			email: data.email,
			githubUsername: data.username
		};
	}
});

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
			username: string;
		};
	}
}
