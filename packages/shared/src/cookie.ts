import { APP_NAME } from './constants';

export enum CookieName {
  AuthSession = `${APP_NAME}_auth-session`,
  ApiLocale = `${APP_NAME}_locale`,
  GoogleOAuthState = `${APP_NAME}_google-oauth-state`,
}
