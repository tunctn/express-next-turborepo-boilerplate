import { HttpException } from '@/exceptions/http.exception';
import { LuciaAuthUser, lucia } from '@/lib/auth';
import { ERROR } from '@/lib/errors';
import type { Request, Response } from 'express';

export const authMiddleware = async ({
  req,
  res,
  loose = false,
}: {
  req: Request;
  res: Response;
  loose?: boolean;
}): Promise<LuciaAuthUser | undefined> => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

  if (!sessionId && loose === false) {
    throw new HttpException(401, ERROR.GENERIC.unauthorized);
  }

  if (!sessionId) return undefined;

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    res.appendHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize());
  }

  if (session && session.fresh) {
    res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize());
  }

  if (user) {
    return user;
  }

  return undefined;
};

export type RequestWithAuth = Request & { user: LuciaAuthUser };
export type RequestWithLooseAuth = Request & { user?: LuciaAuthUser };
