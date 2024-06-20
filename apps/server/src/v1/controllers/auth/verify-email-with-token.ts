import { userEmailVerifications, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { ERROR } from '@/lib/errors';
import { createController } from '@/utils/controller';
import { VerifyEmailSchema, type VerifyEmailResponse } from '@packages/shared';
import { eq } from 'drizzle-orm';

export const verifyEmailWithToken = createController()
  .validate({
    body: VerifyEmailSchema,
  })
  .withAuth()
  .build(async ({ req, res }) => {
    const response: VerifyEmailResponse = true;

    const data = req.body;

    const verificationRequest = await db.select().from(userEmailVerifications).where(eq(userEmailVerifications.token, data.token)).limit(1);
    if (verificationRequest.length === 0) {
      throw new HttpException(400, {
        en: `Please check your email and try again. Or login to get a new verification email.`,
        tr: `Lütfen e-postanızı kontrol edip tekrar deneyin. Ya da yeni bir doğrulama e-postası almak için giriş yapın.`,
      });
    }

    const verification = verificationRequest[0];
    if (!verification) throw new HttpException(500, ERROR.GENERIC['unknown-error']);

    if (verification.expires_at < new Date()) {
      const currentUserRows = await db.select().from(users).where(eq(users.id, verification.user_id)).limit(1);
      const currentUser = currentUserRows[0];
      if (currentUser && currentUser.is_email_address_verified === true) {
        throw new HttpException(400, {
          en: `Your email is already verified.`,
          tr: `E-posta adresiniz zaten daha önce doğrulandı.`,
        });
      }
    }

    await db.update(users).set({ is_email_address_verified: true }).where(eq(users.id, verification.user_id)).returning();
    return res.status(200).json(response);
  });
