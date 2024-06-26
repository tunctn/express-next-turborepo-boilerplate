import type { Config } from 'drizzle-kit';
import { env } from './src/lib/env';

const config: Config = {
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL === 'true',
  },
  schema: './src/db/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
};
export default config;
