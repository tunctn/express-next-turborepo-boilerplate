import { index, jsonb, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";

export const LOG_LEVELS = ["error", "warn", "success", "info", "http", "verbose", "debug", "silly"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];
export const logLevels = pgEnum("log_levels", LOG_LEVELS);

export const systemLogs = pgTable(
  "system_logs",
  {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    level: logLevels("level").notNull(),
    message: text("message").notNull(),
    metadata: jsonb("metadata"),
    stack: text("stack"),
    api_version: text("api_version"),
    user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
    scope: text("scope"),
  },
  (t) => [index("level_message_index").on(t.level, t.message), index("level_created_at_index").on(t.level, t.created_at)],
);
