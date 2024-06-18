import { MessageGroup } from './types';

export const AUTH_ERROR = {
  'token.invalid': {
    en: 'Invalid token.',
    tr: 'Geçersiz token.',
  },
  'token.expired': {
    en: 'Token expired.',
    tr: 'Token süresi doldu.',
  },
  'token.missing': {
    en: 'Token missing.',
    tr: 'Token eksik.',
  },
} as const satisfies MessageGroup;
