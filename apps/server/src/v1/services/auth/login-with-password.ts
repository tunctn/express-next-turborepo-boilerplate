import { userKeys, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import type { BaseService } from '@/interfaces/services.interface';
import { db } from '@/lib/db';
import { ERROR } from '@/lib/errors';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';

interface LoginWithPasswordService extends BaseService {
  payload: {
    email?: string;
    username?: string;
    password: string;
  };
}

export const loginWithPassword = async ({ tx = db, payload }: LoginWithPasswordService) => {
  const { username, password, email } = payload;
  if (!username && !email) {
    throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['login.missing-email-or-username']);
  }
  if (username && email) {
    throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['login.either-email-or-username']);
  }

  // Basic password validation
  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    throw new HttpException(400, ERROR.AUTH['token.invalid']);
  }

  const where = email ? eq(users.email_address, email) : username ? eq(users.username, username) : undefined;
  if (where === undefined) throw new HttpException(500, ERROR.GENERIC['unknown-error']); // Because we already checked for username and email above, this should never happen. Silly typescript...

  const rows = await tx.select().from(users).where(where).limit(1);
  const user = rows[0];
  if (!user) throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['user-not-found']);

  const userKeyRows = await tx.select().from(userKeys).where(eq(userKeys.user_id, user.id)).limit(1);
  const userKey = userKeyRows[0];
  if (!userKey) throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['user-not-found']);

  const validPassword = await verify(userKey.hashed_password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['login.either-email-or-username']);

  return { user };
};
