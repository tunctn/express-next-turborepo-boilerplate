import type { db } from "@packages/database";

export type BaseService = {
  tx: typeof db;
};

export type BaseUserService = BaseService & {
  userId: string;
};
