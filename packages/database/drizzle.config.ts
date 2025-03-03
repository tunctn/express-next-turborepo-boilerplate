import type { Config } from "drizzle-kit";
import { env } from "./src/env";
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;

const config: Config = {
  dbCredentials: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: false,
  },
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
};
export default config;
