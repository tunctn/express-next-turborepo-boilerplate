import { IS_DEV } from '@/config';
import { CORS_ORIGINS } from '@/config/cors';
import type { NextFunction, Request, Response } from 'express';
import { verifyRequestOrigin } from 'lucia';

// Origin verification, CSRF protection
// https://lucia-auth.com/guides/validate-session-cookies/express

export const csrfMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (IS_DEV) return next();

  if (req.method === 'GET') {
    return next();
  }
  const origin = req.headers.origin ?? null;
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = req.headers.host ?? null;

  if (!origin || !hostHeader || !verifyRequestOrigin(origin, CORS_ORIGINS)) {
    return res.status(403).end();
  }

  next();
};
