import { APP } from './constants';

export const RESERVED_WORDS = [
  APP.WEB_URL,
  APP.API_URL,
  APP.WEB_URL.replace('http://', ''),
  APP.API_URL.replace('http://', ''),
  APP.WEB_URL.replace('https://', ''),
  APP.API_URL.replace('https://', ''),

  APP.COM,
  `${APP.COM}-admin`,
  `${APP.COM}admin`,
  `${APP.COM}-admins`,
  `${APP.COM}admins`,

  'new',
  'edit',
  'delete',
  'login',
  'logout',
  'register',
  'auth',
  'signup',
  'signin',
  'signout',
  'sign-up',
  'sign-in',
  'sign-out',
  'log-in',
  'log-out',
  'forgotpassword',
  'resetpassword',

  'mail',
  'mails',
  'email',
  'emails',
  'marketing',
  'notifications',
  'notification',
  'notification-settings',
  'market',
  'shop',
  'forgot-password',
  'reset-password',
  'account',
  'settings',
  'admin',
  'dashboard',
  'orders',
  'order',
  'customers',
  'customer',
  'users',
  'user',
  'payments',
  'payment',
  'reviews',
  'review',
  'coupons',
  'coupon',
  'promotions',
  'promotion',
  'categories',
  'category',
  'items',
  'item',
  'addons',
  'addon',
  'modifiers',
  'modifier',
  'modifier-groups',
  'modifier-group',
  'modifier-options',
  'modifier-option',
  'free',
  'freebie',
  'freebies',
  'test',
  'tests',
  'dev',
  'development',
  'local',
  'localhost',
  'preview',
  'production',
  'pre',
  'prod',
  'testing',
  'qa',
  'live',
] as const;
