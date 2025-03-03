import { HttpException } from "@/exceptions/http.exception";
import { ERROR } from "@/lib/errors";
import { createController } from "@/utils/controller";
import { db, eq, users } from "@packages/database";
import type { GetMeResponse } from "@packages/shared";

export const getMe = createController()
  .withAuth()
  .build(async ({ req, res }) => {
    const userId = req.user.id;

    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = rows[0];
    if (!user) throw new HttpException(500, ERROR.GENERIC["unknown-error"]);

    const response: GetMeResponse = {
      name: user.name,
      email_address: user.email_address,
      id: user.id,
      role: user.role,
    };

    return res.status(200).json(response);
  });
