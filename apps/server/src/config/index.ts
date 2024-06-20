import { env } from '@/lib/env';

export const IS_DEV = env.NODE_ENV === 'development';
export const IS_PROD = env.NODE_ENV === 'production';

export const LOG_FORMAT = IS_DEV ? 'dev' : 'combined';
export const LOG_DIR = '../logs';
