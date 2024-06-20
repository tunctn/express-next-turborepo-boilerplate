import dotenv from 'dotenv';
import path from 'path';
// Load global .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Load app-specific .env
dotenv.config({ path: path.resolve(__dirname, './../../.env') });

import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('4000'),

    DATABASE_URL: z.string(),
    DATABASE_SSL: z.enum(['true', 'false']),
    JWT_SECRET_KEY: z.string(),

    REDIS_URL: z.string(),
    REDIS_TOKEN: z.string(),

    RESEND_API_KEY: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
