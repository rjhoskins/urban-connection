import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import users from './users';

const sessions = pgTable('sessions', {
	id: varchar({ length: 256 }).primaryKey(),
	userId: varchar({ length: 26 })
		.notNull()
		.references(() => users.id),

	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' })
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export default sessions;

export type InsertSession = typeof sessions.$inferInsert;
