import fs from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client, Pool } from "pg";
import { clientConfig } from "./config";
import * as schema from "./schema";

interface MigrateDbProps {
  log?: (message?: any, ...optionalParams: any[]) => void;
  connection: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: string;
    ssl: "true" | "false";
  };
}

export const migrateDb = async (params: MigrateDbProps) => {
  try {
    const { log = console.log, connection } = params;

    log(
      `Connecting to database: postgres://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.name}`,
    );

    const client = new Client({
      host: connection.host,
      port: Number.parseInt(connection.port),
      user: connection.user,
      password: connection.password,
      database: connection.name,
      ssl: false,
    });
    await client.connect();

    log("Connected to database");

    const pool = new Pool(clientConfig);

    log("Creating pool");

    const db = drizzle(pool, { schema });

    console.log("Creating migrations folder");

    // Get the root dir of the project
    let isRoot = false;
    let rootDir = __dirname;
    const pnpmWorkspaceFile = "pnpm-workspace.yaml";

    while (!isRoot) {
      if (fs.existsSync(`${rootDir}/${pnpmWorkspaceFile}`)) {
        isRoot = true;
        break;
      }
      rootDir = path.resolve(rootDir, "..");
    }

    const migrationsFolder = `${rootDir}/packages/database/drizzle`;

    console.log("Migrating database");

    await migrate(db, {
      migrationsFolder: migrationsFolder,
    });

    log(`Connected to database and migrated.`);
  } catch (error) {
    console.error(error);
  }
};
