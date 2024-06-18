import type { BaseUserService } from '@/interfaces/services.interface';
import { db } from '@/lib/db';

interface GetUserService extends BaseUserService {
  userId: string;
}

export const getUser = async ({ userId, tx = db }: GetUserService) => {
  return await tx.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      id: true,
      first_name: true,
      last_name: true,
      username: true,
      email_address: true,
      image: true,
      role: true,
    },
  });
};
