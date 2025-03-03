import { env } from "@/lib/env";
import { IS_DEV } from "@packages/shared";
import type { CorsOptions } from "cors";

export const CORS_ORIGINS = [env.NEXT_PUBLIC_WEB_URL];

export const CORS_OPTIONS: CorsOptions = {
  origin: async (_, callback) => {
    if (IS_DEV) return callback(null, true);

    return callback(null, CORS_ORIGINS);
  },
  credentials: true,
};
