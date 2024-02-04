import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const contact = mysqlTable('contact', {
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	email: varchar('email', { length: 255 }).primaryKey()
});

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey()
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});
