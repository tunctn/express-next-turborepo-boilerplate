import { Resend } from 'resend';
import { env } from './env';

export const resend = new Resend(env.RESEND_API_KEY);

export const EMAIL_ADDRESS_NAME = 'my-app';
export const NOREPLY_EMAIL = `noreply@${env.EMAIL_ADDRESS_DOMAIN}`;
