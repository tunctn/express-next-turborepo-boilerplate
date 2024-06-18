import { loginWithPassword } from './login-with-password';
import { luciaSessionHandler } from './lucia-session-handler';
import { signUpWithPassword } from './sign-up-with-password';

export const authService = {
  signUpWithPassword,
  luciaSessionHandler,
  loginWithPassword,
};
