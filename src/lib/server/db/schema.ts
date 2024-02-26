import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey().notNull(),
	providerId: varchar('provider_id', { length: 255 }),
	username: varchar('username', { length: 255 }).unique(),
	email: varchar('email', { length: 255 }).unique(),
	password: varchar('password', { length: 255 })
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});
