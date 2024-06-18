import { db } from '@/lib/db';

export type BaseService = {
  tx?: typeof db;
};

export type BaseUserService = BaseService & {
  userId: string;
};
