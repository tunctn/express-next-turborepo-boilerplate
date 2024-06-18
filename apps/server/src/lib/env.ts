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
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.string(),

    DATABASE_URL: z.string(),
    JWT_SECRET_KEY: z.string(),

    REDIS_URL: z.string(),
    REDIS_TOKEN: z.string(),

    RESEND_API_KEY: z.string(),
    EMAIL_ADDRESS_DOMAIN: z.string(),
    TEST_EMAIL_ADDRESS: z.string(),

    WEB_URL: z.string(),
    API_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
