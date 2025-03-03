import { APP, FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES, type Locale } from "@packages/shared";
import * as React from "react";
import { translateToNode } from "../utils/dictionary";

interface ForgotPasswordEmailTemplateProps {
  firstName: string;
  url: string;
  locale: Locale;
}

export const ForgotPasswordEmailTemplate: React.FC<Readonly<ForgotPasswordEmailTemplateProps>> = ({ firstName, url, locale }) => {
  const t = translateToNode(locale);
  return (
    <div>
      <h1>
        {t({
          en: `Hi ${firstName},`,
          tr: `Merhaba ${firstName},`,
        })}
      </h1>
      <p>
        {t({
          en: `You recently requested to reset your password for your ${APP.TITLE} account.`,
          tr: `${APP.TITLE} hesabınızın şifresini sıfırlamak için bir talepte bulundunuz.`,
        })}
      </p>
      <p>
        {t({
          en: (
            <>
              To reset your password, click <a href={url}>here</a>.
            </>
          ),
          tr: (
            <>
              Şifrenizi sıfırlamak için <a href={url}>buraya</a> tıklayın.
            </>
          ),
        })}
      </p>
      <p>
        {t({
          en: `If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next ${FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES} minutes.`,
          tr: `Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı dikkate almayın veya bize bildirmek için yanıtlayın. Bu şifre sıfırlama yalnızca ${FORGOT_PASSWORD_VALIDITY_DURATION_IN_MINUTES} dakika için geçerlidir.`,
        })}
      </p>
      <p>{url}</p>

      <p>
        {t({
          en: "Thanks,",
          tr: "Teşekkürler,",
        })}
        <br />
        {APP.TITLE}
      </p>
    </div>
  );
};
