import { MIN_USERNAME_LENGTH } from '@packages/shared';
import { MessageGroup } from './types';

export const USERNAME_ERROR = {
  'cannot-start-with-number': {
    en: 'Username cannot start with a number.',
    tr: 'Kullanıcı adı sayı ile başlayamaz.',
  },
  'cannot-start-with-dash': {
    en: 'Username cannot start with a dash.',
    tr: 'Kullanıcı adı tire ile başlayamaz.',
  },
  'cannot-end-with-dash': {
    en: 'Username cannot end with a dash.',
    tr: 'Kullanıcı adı tire ile bitemez.',
  },
  'invalid-format': {
    en: `Username can only contain letters, numbers and dashes.`,
    tr: `Kullanıcı adı sadece harf, sayı ve tire içerebilir.`,
  },
  'reserved-word': {
    en: 'Username is already in use.',
    tr: 'Bu Kullanıcı adı zaten kullanılıyor.',
  },
  'too-short': {
    en: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
    tr: `Kullanıcı adı en az ${MIN_USERNAME_LENGTH} karakter uzunluğunda olmalıdır.`,
  },
  'too-long': {
    en: `Username must be less than characters long.`,
    tr: `Kullanıcı adı en fazla karakter uzunluğunda olmalıdır.`,
  },
} as const satisfies MessageGroup;
