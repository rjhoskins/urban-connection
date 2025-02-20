import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import district from './districts';
import users from './users';
import { relations } from 'drizzle-orm';
import districts from './districts';

const districtAdmins = pgTable('district_admins', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar('user_id', { length: 256 })
		.notNull()
		.references(() => users.id)
		.unique(), //  only one district admin per district
	districtId: integer('district_id')
		.notNull()
		.references(() => district.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull()
});

export const districtAdminsRelations = relations(districtAdmins, ({ one }) => ({
	user: one(users, {
		fields: [districtAdmins.userId],
		references: [users.id]
	}),
	district: one(districts, {
		fields: [districtAdmins.districtId],
		references: [districts.id]
	})
}));

export default districtAdmins;
