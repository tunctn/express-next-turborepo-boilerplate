import { APP } from '@packages/shared';
import type { CorsOptions } from 'cors';
import { IS_DEV } from '.';

export const CORS_ORIGINS = [APP.WEB_URL];

export const CORS_OPTIONS: CorsOptions = {
  origin: async (_, callback) => {
    if (IS_DEV) return callback(null, true);

    return callback(null, CORS_ORIGINS);
  },
  credentials: true,
};
