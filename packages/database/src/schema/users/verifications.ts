import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseIdModel } from "../abstract";

export const verifications = pgTable("verifications", {
  ...baseIdModel,
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export type Verification = InferSelectModel<typeof verifications>;
export type InsertVerification = InferInsertModel<typeof verifications>;
