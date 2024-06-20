import { HttpException } from '@/exceptions/http.exception';
import { CookieName, DEFAULT_LOCALE, LOCALES, type Locale } from '@packages/shared';
import type { Request } from 'express';
import { ERROR, type ErrorMessage } from '.';

const LOG_LANGUAGE: Locale = 'en';

export const getResponseLanguage = (req: Request) => {
  let responseLanguage = req.cookies[CookieName.ApiLocale] as Locale;
  // let responseLanguage: MainAppLocale = headers['x-response-language'] as MainAppLocale;
  if (LOCALES.includes(responseLanguage) === false) {
    responseLanguage = DEFAULT_LOCALE;
  }
  return responseLanguage;
};

export const createErrorBody = (err: any, req: Request) => {
  const responseLanguage = getResponseLanguage(req);

  let errorMessage: ErrorMessage;
  if (err instanceof HttpException) errorMessage = err.errorMessage;
  else errorMessage = ERROR.GENERIC['unknown-error'];

  const message = {
    body: errorMessage[responseLanguage],
    log: errorMessage[LOG_LANGUAGE],
  };

  const status: number = err.status || 500;
  const body = { message: message.body, code: status };

  return { logMessage: message.log, body, originalError: err, status };
};
