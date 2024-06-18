import { InsertUser, userKeys, userSignupMethods, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import type { BaseService } from '@/interfaces/services.interface';
import { db } from '@/lib/db';
import { ERROR, ErrorMessage } from '@/lib/errors';
import { newId } from '@/utils/id';
import { testUsername } from '@/utils/slug';
import { hash } from '@node-rs/argon2';
import { SignUpMethod, type SignUpWithPasswordPayload } from '@packages/shared';
import { eq } from 'drizzle-orm';

interface SignUpWithPasswordService extends BaseService {
  payload: SignUpWithPasswordPayload;
}

export const createHashedPassword = async (password: string) => {
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return passwordHash;
};

export const signUpWithPassword = async ({ tx = db, payload }: SignUpWithPasswordService) => {
  const { username, password, first_name, last_name, email } = payload;

  // Basic password validation
  if (typeof password !== 'string' || password.length < 7 || password.length > 255) {
    throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['password.invalid-format']);
  }

  // Test slug for username before creating user
  let error: undefined | ErrorMessage = undefined;
  const result = testUsername(username);
  if (result !== true) {
    error = result;
  }

  const passwordHash = await createHashedPassword(password);

  const userId = newId();
  const userPayload: InsertUser = {
    id: userId,
    username,
    first_name: first_name,
    last_name: last_name,
    email_address: email,
    role: 'user',
    image: null,
    is_email_address_verified: false,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
  };

  const existingUsername = await tx.select().from(users).where(eq(users.username, username)).limit(1);
  if (existingUsername.length > 0) throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['username.already-exists']);

  const existingEmail = await tx.select().from(users).where(eq(users.email_address, email)).limit(1);
  if (existingEmail.length > 0) throw new HttpException(400, ERROR.AUTH_LOGIN_SIGNUP['email.already-exists']);

  const insertedUserRows = await db.insert(users).values(userPayload).returning();
  const user = insertedUserRows[0];

  const method: SignUpMethod = 'password';
  await db.insert(userSignupMethods).values({
    id: newId(),
    user_id: user.id,
    method: method,
    key: `${user.id}:${method}`,
    payload: JSON.stringify(userPayload),
  });

  await db.insert(userKeys).values({
    user_id: user.id,
    hashed_password: passwordHash,
  });

  return { user };
};
