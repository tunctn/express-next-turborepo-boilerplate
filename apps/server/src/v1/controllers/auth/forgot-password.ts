import { IS_DEV } from '@/config';
import { userPasswordResetRequests, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { t } from '@/lib/dictionary';
import { env } from '@/lib/env';
import { EMAIL_ADDRESS_NAME, NOREPLY_EMAIL, resend } from '@/lib/resend';
import { createResetPasswordToken } from '@/utils/auth';
import { sleep } from '@/utils/common';
import { createController } from '@/utils/controller';
import { ForgotPasswordEmailTemplate } from '@packages/emails';
import { FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES, ForgotPasswordResponse, ForgotPasswordSchema } from '@packages/shared';
import dayjs from 'dayjs';
import { desc, eq } from 'drizzle-orm';

export const forgotPassword = createController()
  .validate({
    body: ForgotPasswordSchema,
  })
  .build(async ({ req, res }) => {
    const locale = req.locale;
    const response: ForgotPasswordResponse = true;
    const data = req.body;

    const userRows = await db.select().from(users).where(eq(users.email_address, data.email)).limit(1);
    const user = userRows[0];
    if (!user) {
      const randomMinSeconds = 1.2;
      const randomMaxSeconds = 1.7;
      const randomSeconds = Math.floor(Math.random() * (randomMaxSeconds - randomMinSeconds) + randomMinSeconds);
      await sleep(randomSeconds * 1000);

      return res.status(200).json(response);
    }

    const token = await createResetPasswordToken(user.id);
    const existingRequests = await db
      .select()
      .from(userPasswordResetRequests)
      .where(eq(userPasswordResetRequests.user_id, user.id))
      .orderBy(desc(userPasswordResetRequests.created_at));

    if (existingRequests.length > 0) {
      const latestResetPasswordRequest = existingRequests[0];
      const now = dayjs();
      const tokenSentAt = dayjs(latestResetPasswordRequest.created_at);
      const diff = now.diff(tokenSentAt, 'minutes');
      // Check if token is sent under 1 minute
      if (diff < 1) {
        throw new HttpException(400, {
          en: 'Please wait 1 minute before sending another reset password email.',
          tr: 'Lütfen 1 dakika bekleyin.',
        });
      }

      if (existingRequests.length > 5) {
        // Check if last request is more than 30 minutes ago
        if (diff < 30) {
          throw new HttpException(400, {
            en: 'Too many reset password requests.',
            tr: 'Çok fazla şifre sıfırlama isteği.',
          });
        }

        // If not, delete the older requests
        await db.delete(userPasswordResetRequests).where(eq(userPasswordResetRequests.user_id, user.id));
      }
    }

    const expiresAtDatetime = dayjs().add(FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES, 'minutes').toDate();
    await db.insert(userPasswordResetRequests).values({
      id: token,
      user_id: user.id,
      token,
      expires_at: expiresAtDatetime,
    });

    const emailAddress = IS_DEV ? env.TEST_EMAIL_ADDRESS : user.email_address;
    await resend.emails.send({
      from: `${EMAIL_ADDRESS_NAME} <${NOREPLY_EMAIL}>`,
      to: [emailAddress],
      subject: t({ en: 'Reset your password', tr: 'Şifreni sıfırla', locale }),
      react: ForgotPasswordEmailTemplate({
        firstName: user.first_name,
        locale,
        url: `${env.WEB_URL}/auth/reset-password?token=${token}`,
      }) as React.ReactElement,
    });

    return res.status(200).json(response);
  });
