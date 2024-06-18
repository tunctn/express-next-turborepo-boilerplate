import { IS_DEV } from '@/config';
import * as schema from '@/db/index';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Client, ClientConfig, Pool } from 'pg';
import { env } from './env';

const clientConfig: ClientConfig = {
  connectionString: env.DATABASE_URL,
};
clientConfig.ssl = !IS_DEV ? { rejectUnauthorized: false } : false;

export const pool = new Pool(clientConfig);
export const db = drizzle(pool, { schema });

const migrateDb = async () => {
  console.log('Migrating database...');
  const client = new Client(clientConfig);
  await client.connect();
  await migrate(db, { migrationsFolder: path.resolve(__dirname, '../../drizzle') });
  console.log('Database migrated.');

  const connectionUrl = new URL(env.DATABASE_URL);
  if (IS_DEV) {
    const { username, hostname, port } = connectionUrl;
    const password = '***';
    const database = connectionUrl.pathname.slice(1);
    console.log(`Connected to database: postgres://${username}:${password}@${hostname}:${port}/${database}`);
  } else {
    console.log(`Connected to database.`);
  }
};
migrateDb();
