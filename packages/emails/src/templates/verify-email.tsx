import { APP, type Locale } from '@packages/shared';
import * as React from 'react';
import { translateToNode } from '../utils/dictionary';

interface VerifyEmailEmailTemplateProps {
  firstName: string;
  url: string;
  firstTime: boolean;
  locale: Locale;
}

export const VerifyEmailEmailTemplate: React.FC<Readonly<VerifyEmailEmailTemplateProps>> = ({ firstName, url, locale }) => {
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
          tr: `Hesabınızı doğrulamak için aşağıdaki linke tıklayın.`,
          en: `Click the link below to verify your account.`,
        })}
      </p>

      <p>{url}</p>

      <p>
        {t({
          tr: `Eğer bu e-postayı beklemiyorsanız, lütfen dikkate almayın.`,
          en: `If you weren't expecting this email, please ignore it.`,
        })}
      </p>

      <p>
        {t({
          en: 'Thanks,',
          tr: 'Teşekkürler,',
        })}
        <br />
        {APP.TITLE}
      </p>
    </div>
  );
};
