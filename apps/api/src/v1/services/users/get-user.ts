import type { BaseUserService } from "@/interfaces/services.interface";
import { db } from "@packages/database";

interface GetUserService extends BaseUserService {
  userId: string;
}

export const getUser = async ({ userId, tx = db }: GetUserService) => {
  return await tx.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email_address: true,
      is_email_address_verified: true,
      image: true,
      role: true,
    },
  });
};
