import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { clientConfig } from "./config";
import * as schema from "./schema";

export * from "drizzle-orm";
export * from "./schema";
export type { PgColumn, PgTable, IndexColumn } from "drizzle-orm/pg-core";

export const pool = new Pool(clientConfig);
export const db = drizzle(pool, { schema });

export { migrateDb } from "./migrate";
