import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userEmailVerifications = pgTable(
  'user_email_verifications',
  {
    id: text('id').primaryKey().notNull(),
    user_id: text('user_id')
      .references(() => users.id)
      .notNull(),
    token: text('token').unique().notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => {
    return {
      user_id_token_key: uniqueIndex('user_email_verifications__user_id_token_key').on(table.user_id, table.token),
    };
  },
);

export const userEmailVerificationRelations = relations(userEmailVerifications, ({ one }) => ({
  user: one(users, { fields: [userEmailVerifications.user_id], references: [users.id] }),
}));
export type UserEmailVerification = InferSelectModel<typeof userEmailVerifications>;
export type InsertUserEmailVerification = InferInsertModel<typeof userEmailVerifications>;
