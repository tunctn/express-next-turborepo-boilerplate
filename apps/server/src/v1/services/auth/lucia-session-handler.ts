import { HttpException } from '@/exceptions/http.exception';
import { lucia } from '@/lib/auth';
import { ERROR } from '@/lib/errors';
import { logger } from '@/utils/logger';
import type { Response } from 'express';

export const luciaSessionHandler = async ({ userId, res }: { userId: string; res: Response }) => {
  try {
    const session = await lucia.createSession(userId, { user_id: userId });
    const sessionCookie = lucia.createSessionCookie(session.id);

    res.appendHeader('Set-Cookie', sessionCookie.serialize());
    return res;
  } catch (e) {
    logger.error(e);
    throw new HttpException(500, ERROR.GENERIC['unknown-error']);
  }
};
