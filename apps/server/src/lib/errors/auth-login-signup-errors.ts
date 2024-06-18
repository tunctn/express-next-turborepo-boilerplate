import { MessageGroup } from './types';

export const AUTH_LOGIN_SIGNUP_ERROR = {
  'signup.email-already-registered-with-another-signup-method': {
    en: 'This email address is already registered with another sign up method. Please use that method to sign in.',
    tr: 'Bu e-posta adresi başka bir kayıt yöntemiyle zaten kayıtlı. Lütfen bu yöntemi kullanarak giriş yapın.',
  },
  'login.missing-email-or-username': {
    en: 'Missing email or username.',
    tr: 'E-posta veya kullanıcı adı eksik.',
  },
  'login.missing-password': {
    en: 'Missing password.',
    tr: 'Şifre eksik.',
  },
  'password.invalid-format': {
    en: 'Invalid password format.',
    tr: 'Geçersiz şifre biçimi.',
  },
  'login.either-email-or-username': {
    en: 'Either email or username is required.',
    tr: 'E-posta veya kullanıcı adı gerekli.',
  },
  'login.invalid-credentials': {
    en: 'Invalid credentials or user does not exist.',
    tr: 'Böyle bir kullanıcı yok veya giriş bilgileri hatalı.',
  },
  'user-not-found': {
    en: 'User not found.',
    tr: 'Kullanıcı bulunamadı.',
  },
  'username.already-exists': {
    en: 'Username already exists.',
    tr: 'Kullanıcı adı zaten var.',
  },
  'username.invalid': {
    en: 'Invalid username.',
    tr: 'Geçersiz kullanıcı adı.',
  },
  'email.already-exists': {
    en: 'Email is already in use.',
    tr: 'E-posta zaten kullanımda.',
  },
  'email.invalid': {
    en: 'Invalid email.',
    tr: 'Geçersiz e-posta.',
  },
} as const satisfies MessageGroup;
