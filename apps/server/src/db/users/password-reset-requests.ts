import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userPasswordResetRequests = pgTable(
  'user_password_reset_requests',
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
      user_id_token_key: uniqueIndex('user_password_reset_requests__user_id_token_key').on(table.user_id, table.token),
    };
  },
);
export const userPasswordResetRequestRelations = relations(userPasswordResetRequests, ({ one }) => ({
  user: one(users, { fields: [userPasswordResetRequests.user_id], references: [users.id] }),
}));
export type UserPasswordResetRequest = InferSelectModel<typeof userPasswordResetRequests>;
export type InsertUserPasswordResetRequest = InferInsertModel<typeof userPasswordResetRequests>;
