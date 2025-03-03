import type { ClientConfig } from "pg";
import { env } from "./env";

export const clientConfig: ClientConfig = {
  host: env.DB_HOST,
  port: Number.parseInt(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: false,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
  statement_timeout: 10000,
  idle_in_transaction_session_timeout: 10000,
};
