import { forgotPassword } from './forgot-password';
import { loginWithGoogle } from './login-with-google';
import { loginWithGoogleCallback } from './login-with-google-callback';
import { loginWithEmailPassword, loginWithUsernamePassword } from './login-with-password';
import { resetPassword } from './reset-password';
import { sendVerifyEmailToken } from './send-verify-email-token';
import { signUpWithPassword } from './sign-up-with-password';
import { verifyEmailWithToken } from './verify-email-with-token';
export const authController = {
  signUpWithPassword,
  loginWithUsernamePassword,
  loginWithEmailPassword,
  loginWithGoogle,
  loginWithGoogleCallback,

  forgotPassword,
  resetPassword,
  sendVerifyEmailToken,
  verifyEmailWithToken,
};
