import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseIdModel } from "../abstract";
import { users } from "./users";

export const accounts = pgTable("accounts", {
  ...baseIdModel,
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  account_id: text("account_id").notNull(),
  provider_id: text("provider_id").notNull(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  access_token_expires_at: timestamp("access_token_expires_at", { withTimezone: true }),
  refresh_token_expires_at: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  id_token: text("id_token"),
  password: text("password"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export type Account = InferSelectModel<typeof accounts>;
export type InsertAccount = InferInsertModel<typeof accounts>;
