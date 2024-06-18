import { IS_DEV } from '@/config';
import { userEmailVerifications, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { t } from '@/lib/dictionary';
import { env } from '@/lib/env';
import { ERROR } from '@/lib/errors';
import { EMAIL_ADDRESS_NAME, NOREPLY_EMAIL, resend } from '@/lib/resend';
import { createController } from '@/utils/controller';
import { newId } from '@/utils/id';
import { VerifyEmailEmailTemplate } from '@packages/emails';
import { SendVerifyEmailTokenResponse, SendVerifyEmailTokenSchema, VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES } from '@packages/shared';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';

export const sendVerifyEmailToken = createController()
  .validate({
    body: SendVerifyEmailTokenSchema,
  })
  .withAuth()
  .build(async ({ req, res }) => {
    const user = req.user;
    const locale = req.locale;
    const response: SendVerifyEmailTokenResponse = true;

    const data = req.body;

    const existingUsers = await db.select().from(users).where(eq(users.email_address, data.email_address)).limit(1);
    const existingUser = existingUsers[0];
    if (!existingUser) {
      throw new HttpException(404, { tr: 'Böyle bir kullanıcı bulunamadı', en: 'User not found' });
    }
    if (user.role !== 'admin' && user.id !== existingUser.id) {
      throw new HttpException(403, ERROR.GENERIC.forbidden);
    }

    const existingTokenRows = await db.query.userEmailVerifications.findMany({
      where: (table, { eq }) => eq(table.user_id, existingUser.id),
      orderBy: (table, { desc }) => desc(table.created_at),
    });

    if (existingTokenRows.length > 0) {
      const existingToken = existingTokenRows[0];
      const now = new Date();
      const createdAt = new Date(existingToken.created_at);
      const diff = now.getTime() - createdAt.getTime();

      const waitForMinutes = 60 * 1000; // 1 minute
      if (diff < waitForMinutes) {
        throw new HttpException(400, {
          tr: 'Zaten bir doğrulama e-postası gönderildi. Lütfen bir dakika bekleyin.',
          en: 'A verification email has already been sent. Please wait a minute.',
        });
      }
    }

    const token = newId(32);
    const expiresAtDatetime = dayjs().add(VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES, 'minutes').toDate();
    const emailVerificationTokenRows = await db
      .insert(userEmailVerifications)
      .values({
        id: token,
        user_id: existingUser.id,
        token,
        expires_at: expiresAtDatetime,
      })
      .returning();
    const emailVerificationToken = emailVerificationTokenRows[0].token;

    const verifyEmail = IS_DEV ? env.TEST_EMAIL_ADDRESS : existingUser.email_address;
    await resend.emails.send({
      from: `${EMAIL_ADDRESS_NAME} <${NOREPLY_EMAIL}>`,
      to: [verifyEmail],
      subject: t({ en: 'Verify your account', tr: 'Hesabını doğrula', locale }),
      react: VerifyEmailEmailTemplate({
        firstName: existingUser.first_name,
        locale,
        url: `${env.WEB_URL}/auth/verify-email?token=${emailVerificationToken}`,
        firstTime: true,
      }) as React.ReactElement,
    });

    return res.status(200).json(response);
  });
