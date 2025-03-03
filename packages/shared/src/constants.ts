export const IS_DEV = process.env["NODE_ENV"] === "development";

export const APP = {
  COM: "monorepoapp.com",
  TITLE: "Monorepo App", // e.g. title of the app or email subject

  // email
  EMAIL_ADDRESS: {
    NOREPLY: "noreply@monorepoapp.com", // used for emails that are sent to the user, e.g. password reset
    TEST: "johndoe@gmail.com", // used while dev env to send emails
  },

  API_VERSION: "v1",
} as const;

export const MAX_USERNAME_LENGTH = 48;
export const MIN_USERNAME_LENGTH = 3;

export const LOCALES = ["en", "tr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
export const VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES = 60; // minutes
