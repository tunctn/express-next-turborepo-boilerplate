import { userKeys, userPasswordResetRequests, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { ERROR } from '@/lib/errors';
import { createController } from '@/utils/controller';
import { transaction } from '@/utils/db';
import { authService } from '@/v1/services/auth';
import { createHashedPassword } from '@/v1/services/auth/sign-up-with-password';
import { ResetPasswordSchema, type ResetPasswordResponse } from '@packages/shared';
import { eq } from 'drizzle-orm';

export const resetPassword = createController()
  .validate({
    body: ResetPasswordSchema,
  })
  .build(async ({ req, res }) => {
    const data = req.body;

    let response: ResetPasswordResponse = false;

    const { password, token, passwordAgain } = data;
    if (password !== passwordAgain) {
      throw new HttpException(400, {
        en: 'Passwords do not match.',
        tr: 'Parolalar uyuşmuyor.',
      });
    }

    const user = await transaction(db, async tx => {
      const resetPasswordRequestRows = await tx.select().from(userPasswordResetRequests).where(eq(userPasswordResetRequests.token, token)).limit(1);
      const resetPasswordRequest = resetPasswordRequestRows[0];

      if (!resetPasswordRequest) {
        throw new HttpException(400, {
          tr: 'Geçersiz şifre sıfırlama kodu.',
          en: 'Invalid reset password token.',
        });
      }

      if (resetPasswordRequest.expires_at < new Date()) {
        throw new HttpException(400, {
          tr: 'Geçersiz şifre sıfırlama kodu.',
          en: 'Invalid reset password token.',
        });
      }

      const hashedPassword = await createHashedPassword(password);

      // Delete old password
      await tx.delete(userKeys).where(eq(userKeys.user_id, resetPasswordRequest.user_id));

      await tx.insert(userKeys).values({
        user_id: resetPasswordRequest.user_id,
        hashed_password: hashedPassword,
      });

      // Delete all reset password requests for the user
      await tx.delete(userPasswordResetRequests).where(eq(userPasswordResetRequests.user_id, resetPasswordRequest.user_id));

      const updatedUser = await tx.select().from(users).where(eq(users.id, resetPasswordRequest.user_id)).limit(1);
      const user = updatedUser[0];
      if (!user) throw new HttpException(500, ERROR.GENERIC['unknown-error']);

      return user;
    });

    res = await authService.luciaSessionHandler({ userId: user.id, res });

    return res.status(200).json(response);
  });
