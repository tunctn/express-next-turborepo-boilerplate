export const IS_DEV = process.env['NODE_ENV'] === 'development';

const APP_URLS = {
  WEB: {
    DEV: 'http://192.168.0.181:3000',
    PROD: 'https://www.my-app.com',
  },
  API: {
    DEV: 'http://192.168.0.181:4000',
    PROD: 'https://api.my-app.com',
  },
} as const;

export const APP = {
  COM: 'my-app.com',
  TITLE: 'My App', // e.g. title of the app or email subject

  // email
  EMAIL_ADDRESS: {
    NOREPLY: 'noreply@my-app.com', // used for emails that are sent to the user, e.g. password reset
    TEST: 'johndoe@gmail.com', // used while dev env to send emails
  },

  // urls
  WEB_URL: APP_URLS.WEB[IS_DEV ? 'DEV' : 'PROD'],
  API_URL: APP_URLS.API[IS_DEV ? 'DEV' : 'PROD'],

  API_VERSION: 'v1',
} as const;

export const MAX_USERNAME_LENGTH = 48;
export const MIN_USERNAME_LENGTH = 3;

export const LOCALES = ['en', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
export const VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
