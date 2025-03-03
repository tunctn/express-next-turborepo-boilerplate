import { ACCESS_CONTROL_ERROR } from "./access-control-errors";
import { AUTH_ERROR } from "./auth-errors";
import { AUTH_LOGIN_SIGNUP_ERROR } from "./auth-login-signup-errors";
import { GENERIC_ERROR } from "./generic-errors";
import { USERNAME_ERROR } from "./username-errors";

export type { ErrorMessage } from "./types";

export const ERROR = {
  GENERIC: GENERIC_ERROR,
  ACCESS_CONTROL: ACCESS_CONTROL_ERROR,
  AUTH: AUTH_ERROR,
  AUTH_LOGIN_SIGNUP: AUTH_LOGIN_SIGNUP_ERROR,
  USERNAME: USERNAME_ERROR,
} as const;
