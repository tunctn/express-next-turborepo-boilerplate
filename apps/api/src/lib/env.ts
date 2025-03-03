import { resolveEnvs } from "@packages/env";
resolveEnvs();

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const createdEnv = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("4000"),

    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_SSL: z.enum(["true", "false"]),

    JWT_SECRET_KEY: z.string(),

    RESEND_API_KEY: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    WEBHOOK_ENDPOINT: z.string(),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    NEXT_PUBLIC_WEB_URL: z.string(),
    NEXT_PUBLIC_API_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const env = {
  ...createdEnv,
};

export const updateEnv = ({ key, value }: { key: keyof typeof env; value: string }) => {
  if (env[key]) {
    env[key] = value as never;
  }
};

export const updateStripeWebhookSecretEnv = (webhookSecret: string) => {
  env.STRIPE_WEBHOOK_SECRET = webhookSecret;
};
