import { UserSession } from '@/db';
import { LuciaAuthUser } from '@/lib/auth';
import { env } from '@/lib/env';
import { SignJWT, jwtVerify } from 'jose';
import util from 'util';

interface JWTData {
  user: LuciaAuthUser;
  session: UserSession;
}

export const createAuthToken = async (user: LuciaAuthUser, session: UserSession): Promise<{ token: string }> => {
  const now = new Date();

  const payload: JWTData = { user, session };

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(session.expiresAt)
    .setIssuedAt(now)
    .setNotBefore(now)
    .sign(new util.TextEncoder().encode(env.JWT_SECRET_KEY));

  return { token };
};

export const verifyAuthToken = async (token: string): Promise<JWTData | null> => {
  try {
    const authToken = await jwtVerify(token, new util.TextEncoder().encode(env.JWT_SECRET_KEY));
    return authToken.payload as unknown as JWTData;
  } catch (e) {
    return null;
  }
};

export const createResetPasswordToken = async (userId: string) => {
  const iat = Math.floor(Date.now() / 1000);
  const day = 60 * 60 * 24; // 1 day
  const exp = iat + day;

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new util.TextEncoder().encode(env.JWT_SECRET_KEY));

  return token;
};

export const validateResetPasswordToken = async (token: string) => {
  try {
    const authToken = await jwtVerify(token, new util.TextEncoder().encode(env.JWT_SECRET_KEY));

    return (authToken.payload as any).userId as string;
  } catch (e) {
    console.log(e);
    return null;
  }
};
