const COOKIE_PREFIX = "my-app";
export const COOKIE_NAME = {
  AUTH_SESSION: `${COOKIE_PREFIX}_auth-session`,
  API_LOCALE: `${COOKIE_PREFIX}_locale`,
  APP_LOCALE: `${COOKIE_PREFIX}_app-locale`,
  GOOGLE_OAUTH_STATE: `${COOKIE_PREFIX}_google-oauth-state`,
} as const;
