export const APP_NAME = 'my-app';
export const APP_TITLE = 'My App';

export const MAX_USERNAME_LENGTH = 48;
export const MIN_USERNAME_LENGTH = 3;

export const API_LOCALE_COOKIE_NAME = `${APP_NAME}_locale`;

export const LOCALES = ['en', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
export const VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
