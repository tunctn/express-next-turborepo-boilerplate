// import type { Lucia } from '@/types/lucia';
import { userSessions, users } from '@/db';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { IS_PROD } from '@/config';
import { CookieName, type UserRole } from '@packages/shared';
import { Lucia, TimeSpan } from 'lucia';
import { db } from './db/db';

const adapter = new DrizzlePostgreSQLAdapter(db, userSessions, users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    name: CookieName.AuthSession,
    attributes: {
      secure: IS_PROD,
    },
  },
  getUserAttributes: attributes => {
    return {
      id: attributes.id,
      username: attributes.username,
      email_address: attributes.email_address,
      role: attributes.role,
    };
  },
  getSessionAttributes: attributes => {
    return {
      user_id: attributes.user_id,
    };
  },
});

// export const googleAuth = new Google(
//   //
//   env.GOOGLE_OAUTH_CLIENT_ID,
//   env.GOOGLE_OAUTH_CLIENT_SECRET,
//   `${SERVER_DOMAIN}/auth/login/google/callback`,
// );

export type Auth = typeof lucia;

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: LuciaAuthUser;
    DatabaseSessionAttributes: LuciaSession;
  }
}

export interface LuciaAuthUser {
  id: string;
  username: string;
  email_address: string;
  role: UserRole;
}

interface LuciaSession {
  user_id: string;
}
