import { SIGN_UP_METHODS, USER_ROLES } from '@packages/shared';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { userEmailVerifications } from './email-verifications';
import { userPasswordResetRequests } from './password-reset-requests';

export const userRole = pgEnum('user_role', USER_ROLES);
export const signUpMethodEnum = pgEnum('sign_up_method', SIGN_UP_METHODS);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    username: text('username').unique().notNull(),
    email_address: text('email_address').unique().notNull(),
    image: text('image'),
    role: userRole('role').default('user').notNull(),
    is_email_address_verified: boolean('is_email_address_verified').default(false).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  table => {
    return {
      email_address_key: uniqueIndex('users__email_address_key').on(table.email_address),
      username_key: uniqueIndex('users__username_key').on(table.username),
    };
  },
);

export const userSignupMethods = pgTable('user_signup_methods', {
  id: varchar('id').primaryKey(),
  user_id: varchar('user_id', { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  method: signUpMethodEnum('method').notNull(),
  key: text('key').unique().notNull(),
  payload: text('payload').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
export type UserSignupMethod = InferSelectModel<typeof userSignupMethods>;

export const userSessions = pgTable('user_sessions', {
  id: varchar('id', { length: 128 }).primaryKey(),
  userId: varchar('user_id', { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
  }).notNull(),
});
export type UserSession = InferSelectModel<typeof userSessions>;

export const userKeys = pgTable('user_keys', {
  user_id: varchar('user_id', { length: 15 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  hashed_password: varchar('hashed_password', { length: 255 }).notNull(),
});
export type UserKey = InferSelectModel<typeof userKeys>;

export const usersRelations = relations(users, ({ many }) => ({
  emailVerifications: many(userEmailVerifications),
  passwordResetRequests: many(userPasswordResetRequests),
}));

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
