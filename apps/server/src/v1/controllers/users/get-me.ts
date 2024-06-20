import { users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { ERROR } from '@/lib/errors';
import { createController } from '@/utils/controller';
import { type GetMeResponse } from '@packages/shared';
import { eq } from 'drizzle-orm';

export const getMe = createController()
  .withAuth()
  .build(async ({ req, res }) => {
    const userId = req.user.id;

    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = rows[0];
    if (!user) throw new HttpException(500, ERROR.GENERIC['unknown-error']);

    const response: GetMeResponse = {
      email_address: user.email_address,
      first_name: user.first_name,
      id: user.id,
      last_name: user.last_name,
      role: user.role,
      username: user.username,
    };

    return res.status(200).json(response);
  });
