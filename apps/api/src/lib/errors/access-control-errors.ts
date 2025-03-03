import type { MessageGroup } from './types';

export const ACCESS_CONTROL_ERROR = {
  'requires-auth-middleware': {
    en: 'This route requires auth middleware.',
    tr: 'This route requires auth middleware.',
  },
} as const satisfies MessageGroup;
