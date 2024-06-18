import type { Route } from '@/interfaces/routes.interface';
import { authController as c } from '@/v1/controllers/auth';
import { Router } from 'express';

const router = Router();
const path = '/auth';

router.post('/forgot-password', c.forgotPassword);
router.post('/reset-password', c.resetPassword);
router.post('/send-verify-email-token', c.sendVerifyEmailToken);
router.post('/verify-email-with-token', c.verifyEmailWithToken);

router.get('/login/google', c.loginWithGoogle);
router.get('/login/google/callback', c.loginWithGoogleCallback);

router.post('/sign-up/password', c.signUpWithPassword);
router.post('/login/email-and-password', c.loginWithEmailPassword);
router.post('/login/username-and-password', c.loginWithUsernamePassword);

export const authRoute: Route = { path, router };
