import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseIdModel } from "../abstract";
import { users } from "../users/users";

export const sessions = pgTable("sessions", {
  ...baseIdModel,
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;
