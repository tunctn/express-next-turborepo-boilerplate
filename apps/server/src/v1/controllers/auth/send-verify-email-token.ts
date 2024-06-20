import { IS_DEV } from '@/config';
import { userEmailVerifications, users } from '@/db';
import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { t } from '@/lib/dictionary';
import { ERROR } from '@/lib/errors';
import { resend } from '@/lib/resend';
import { createController } from '@/utils/controller';
import { newId } from '@/utils/id';
import { VerifyEmailEmailTemplate } from '@packages/emails';
import { APP, SendVerifyEmailTokenSchema, VERIFY_EMAIL_VALIDITY_DURATION_IN_MINUTES, type SendVerifyEmailTokenResponse } from '@packages/shared';
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
      if (!existingToken) throw new HttpException(500, ERROR.GENERIC['unknown-error']);

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
    const emailVerificationTokenRow = emailVerificationTokenRows[0];
    if (!emailVerificationTokenRow) throw new HttpException(500, ERROR.GENERIC['unknown-error']);

    const emailVerificationToken = emailVerificationTokenRow.token;

    const emailAddress = IS_DEV ? APP.EMAIL_ADDRESS.TEST : user.email_address;

    await resend.emails.send({
      from: `${APP.TITLE} <${APP.EMAIL_ADDRESS.NOREPLY}>`,
      to: [emailAddress],
      subject: t({ en: 'Verify your account', tr: 'Hesabını doğrula', locale }),
      react: VerifyEmailEmailTemplate({
        firstName: existingUser.first_name,
        locale,
        url: `${APP.WEB_URL}/auth/verify-email?token=${emailVerificationToken}`,
        firstTime: true,
      }) as React.ReactElement,
    });

    return res.status(200).json(response);
  });
