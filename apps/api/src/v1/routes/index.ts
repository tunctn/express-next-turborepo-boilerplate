import type { Route } from "@/interfaces/routes.interface";

import { usersRoute } from "./users.route";

export const v1Routes: Route[] = [
  // /users
  usersRoute,
];
