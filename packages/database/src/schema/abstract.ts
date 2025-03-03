import { newDatabaseRowId } from "@packages/shared";
import { text, timestamp } from "drizzle-orm/pg-core";

export const baseIdModel = {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => newDatabaseRowId()),
};

export const baseModel = {
  ...baseIdModel,
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
};

export const baseModelWithUser = {
  ...baseModel,
  created_by_id: text("created_by_id")
    .notNull()
    .references(() => {
      const { users } = require("./users/users");
      return users.id;
    }),
  updated_by_id: text("updated_by_id").references(() => {
    const { users } = require("./users/users");
    return users.id;
  }),
  deleted_by_id: text("deleted_by_id").references(() => {
    const { users } = require("./users/users");
    return users.id;
  }),
};
