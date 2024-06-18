import type { Route } from '@/interfaces/routes.interface';

import { authRoute } from './auth.route';
import { usersRoute } from './users.route';

export const v1Routes: Route[] = [
  // /auth
  authRoute,

  // /users
  usersRoute,
];
