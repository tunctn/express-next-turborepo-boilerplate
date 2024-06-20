const COOKIE_PREFIX = 'my-app';
export enum CookieName {
  AuthSession = `${COOKIE_PREFIX}_auth-session`,
  ApiLocale = `${COOKIE_PREFIX}_locale`,
  GoogleOAuthState = `${COOKIE_PREFIX}_google-oauth-state`,
}
