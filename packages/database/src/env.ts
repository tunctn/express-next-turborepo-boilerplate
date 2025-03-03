import { resolveEnvs } from "@packages/env";
resolveEnvs();

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("4000"),

    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_SSL: z.enum(["true", "false"]),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
