import type { MessageGroup } from './types';

export const GENERIC_ERROR = {
  'invalid-json': {
    en: 'Invalid JSON.',
    tr: 'Geçersiz JSON.',
  },
  'not-found': {
    en: 'Not found.',
    tr: 'İçerik bulunamadı.',
  },
  unauthorized: {
    en: 'Unauthorized.',
    tr: 'Lütfen giriş yapın.',
  },
  forbidden: {
    en: 'Forbidden.',
    tr: 'Bu işlemi yapmaya yetkiniz yok.',
  },
  'invalid-request': {
    en: 'Invalid request.',
    tr: 'Geçersiz istek.',
  },
  'unknown-error': {
    en: 'An unknown error occurred.',
    tr: 'Bilinmeyen bir hata oluştu.',
  },
} as const satisfies MessageGroup;
