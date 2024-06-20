// Basic translations for zod errors
// https://github.com/aiji42/zod-i18n/blob/main/packages/core/locales/en/zod.json

import { z } from 'zod';
import { type Locale } from './constants';

type CustomZodErrorMap = (
  issue: z.ZodIssueOptionalMessage,
  _ctx: z.ErrorMapCtx,
  locale: Locale,
) => {
  message: string;
};

const customErrorMap: CustomZodErrorMap = (issue, ctx, locale) => {
  let err: string = ctx.defaultError;

  const t = (translations: Record<Locale, string>) => {
    return translations[locale] ?? translations['en'];
  };

  if (issue.code === z.ZodIssueCode.invalid_arguments) {
    err = t({ en: 'Invalid arguments.', tr: 'Geçersiz argümanlar.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_date) {
    err = t({ en: 'Invalid date.', tr: 'Geçersiz tarih.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    err = t({ en: 'Invalid value.', tr: 'Geçersiz değer.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_intersection_types) {
    err = t({ en: 'Invalid types.', tr: 'Geçersiz değerler.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_literal) {
    err = t({ en: 'Invalid literal.', tr: 'Geçersiz literal.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_return_type) {
    err = t({ en: 'Invalid return type.', tr: 'Invalid return type.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_type) {
    err = t({
      en: `${issue.expected} expected, received ${issue.received}`,
      tr: `${issue.expected} gereklidir, ${issue.received} alındı`,
    });
  }

  if (issue.code === z.ZodIssueCode.invalid_union) {
    err = t({ en: 'Invalid input.', tr: 'Geçersiz giriş.' });
  }

  if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
    err = t({
      en: 'Invalid discriminator.',
      tr: 'Geçersiz discriminator.',
    });
  }

  if (issue.code === z.ZodIssueCode.not_finite) {
    err = t({ en: 'Number must be finite.', tr: 'Sayı sonsuz olamaz.' });
  }

  if (issue.code === z.ZodIssueCode.not_multiple_of) {
    err = t({
      en: `Number must be a multiple of ${issue.multipleOf}.`,
      tr: `Girilen sayı, ${issue.multipleOf} sayısına bölünebilir olmalıdır.`,
    });
  }

  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'array') {
      if (issue.exact === true) {
        err = t({
          en: `Array must contain exactly ${issue.maximum} element(s).`,
          tr: `Dizi tam olarak ${issue.maximum} eleman içermelidir.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `Array must contain at most ${issue.maximum} element(s).`,
          tr: `Dizi en fazla ${issue.maximum} eleman içerebilir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `Array must contain less than ${issue.maximum} element(s).`,
          tr: `Dizi ${issue.maximum} elemandan daha az eleman içermelidir.`,
        });
      }
    }

    if (issue.type === 'string') {
      if (issue.exact === true) {
        err = t({
          en: `This field must contain exactly ${issue.maximum} character(s).`,
          tr: `Bu alan tam olarak ${issue.maximum} karakter içermelidir.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `This field must contain at most ${issue.maximum} character(s).`,
          tr: `Bu alan en fazla ${issue.maximum} karakter içerebilir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `This field must contain less than ${issue.maximum} character(s).`,
          tr: `Bu alan ${issue.maximum} karakterdan daha az karakter içermelidir.`,
        });
      }
    }

    if (issue.type === 'number') {
      if (issue.exact === true) {
        err = t({
          en: `This must be exactly ${issue.maximum}.`,
          tr: `Tam olarak ${issue.maximum} olmalıdır.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `This must be less than or equal to ${issue.maximum}.`,
          tr: `En fazla ${issue.maximum} olabilir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `This must be less than ${issue.maximum}.`,
          tr: `${issue.maximum} sayısından daha az olmalıdır.`,
        });
      }
    }

    if (issue.type === 'set') {
      err = 'Invalid input.';
    }

    if (issue.type === 'date') {
      if (issue.exact === true) {
        err = t({
          en: `Date must be exactly ${issue.maximum}.`,
          tr: `Tarih ${issue.maximum} olmalıdır.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `Date must be smaller than or equal to ${issue.maximum}.`,
          tr: `Tarih en geç ${issue.maximum} olabilir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `Date must be smaller than ${issue.maximum}.`,
          tr: `${issue.maximum} tarihinden daha erken olmalıdır.`,
        });
      }
    }
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'array') {
      if (issue.exact === true) {
        err = t({
          en: `Array must contain exactly ${issue.minimum} element(s).`,
          tr: `Dizi tam olarak ${issue.minimum} eleman içermelidir.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `Array must contain at least ${issue.minimum} element(s).`,
          tr: `Dizi en az ${issue.minimum} eleman içermelidir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `Array must contain more than ${issue.minimum} element(s).`,
          tr: `Dizi en az ${parseInt(issue.minimum.toString()) + 1} eleman içermelidir.`,
        });
      }
    }

    if (issue.type === 'string') {
      if (issue.minimum === 1) {
        err = t({
          en: 'This field is required.',
          tr: 'Bu alan gereklidir.',
        });
      } else {
        if (issue.exact === true) {
          err = t({
            en: `This field must contain exactly ${issue.minimum} character(s).`,
            tr: `Bu alan tam olarak ${issue.minimum} karakter içermelidir.`,
          });
        }

        if (issue.inclusive === true) {
          err = t({
            en: `This field must contain at least ${issue.minimum} character(s).`,
            tr: `Bu alan en az ${issue.minimum} karakter içermelidir.`,
          });
        }

        if (issue.inclusive === false) {
          err = t({
            en: `This field must contain more than ${issue.minimum} character(s).`,
            tr: `Bu alan en az ${parseInt(issue.minimum.toString()) + 1} karakter içermelidir.`,
          });
        }
      }
    }

    if (issue.type === 'number') {
      if (issue.exact === true) {
        err = t({
          en: `This must be exactly ${issue.minimum}.`,
          tr: `Tam olarak ${issue.minimum} olmalıdır.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `This must be at least ${issue.minimum}.`,
          tr: `En az ${issue.minimum} olabilir.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `This must be more than ${issue.minimum}.`,
          tr: `${issue.minimum} sayısından daha fazla olmalıdır.`,
        });
      }
    }

    if (issue.type === 'set') {
      err = 'Invalid input.';
    }

    if (issue.type === 'date') {
      if (issue.exact === true) {
        err = t({
          en: `Date must be exactly ${issue.minimum}.`,
          tr: `Tarih ${issue.minimum} olmalıdır.`,
        });
      }

      if (issue.inclusive === true) {
        err = t({
          en: `Date must be greater than or equal to ${issue.minimum}.`,
          tr: `Tarih, ${issue.minimum} tarihinden daha geç veya eşit olmalıdır.`,
        });
      }

      if (issue.inclusive === false) {
        err = t({
          en: `Date must be greater than ${issue.minimum}.`,
          tr: `Tarih ${issue.minimum} tarihinden daha geç olmalıdır.`,
        });
      }
    }
  }

  if (issue.code === z.ZodIssueCode.unrecognized_keys) {
    err = t({ en: 'Unrecognized keys.', tr: 'Unrecognized keys.' });
  }

  return { message: err };
};

export const zodT = (t: Locale) => z.setErrorMap((issue, ctx) => customErrorMap(issue, ctx, t));
