import { env } from '@/lib/env';
import type { CorsOptions } from 'cors';
import { IS_DEV } from '.';

export const CORS_ORIGINS = IS_DEV ? ['http://192.168.0.181:3000', 'http://localhost:3000'] : [env.WEB_URL];

export const CORS_OPTIONS: CorsOptions = {
  origin: async (origin, callback) => {
    if (IS_DEV) return callback(null, true);

    return callback(null, CORS_ORIGINS);
  },
  credentials: true,
};
