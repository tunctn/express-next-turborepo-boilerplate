import { SIGN_UP_METHODS, USER_ROLES } from "@packages/shared";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseIdModel } from "../abstract";

export const userRole = pgEnum("user_role", USER_ROLES);
export const signUpMethodEnum = pgEnum("sign_up_method", SIGN_UP_METHODS);

export const users = pgTable("users", {
  ...baseIdModel,
  name: text("name").notNull(),
  email_address: text("email_address").unique().notNull(),
  is_email_address_verified: boolean("is_email_address_verified").default(false).notNull(),
  image: text("image"),
  role: userRole("role").default("user").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
