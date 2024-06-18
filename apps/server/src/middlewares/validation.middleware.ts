import type { Request } from 'express';
import { ZodError, ZodSchema } from 'zod';

export type RequestValidation<TParams, TQuery, TBody> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};

type ValidationError = { type: 'query' | 'params' | 'body'; errors: ZodError<any> };

export const validationMiddleware = <TParams = unknown, TQuery = unknown, TBody = unknown>({
  params,
  query,
  body,
  req,
}: RequestValidation<TParams, TQuery, TBody> & { req: Request }) => {
  const errors: ValidationError[] = [];

  if (params) {
    const parsed = params.safeParse(req.params);
    if (!parsed.success) {
      errors.push({ type: 'params', errors: parsed.error });
    }
  }
  if (query) {
    const parsed = query.safeParse(req.query);
    if (!parsed.success) {
      errors.push({ type: 'query', errors: parsed.error });
    }
  }
  if (body) {
    const parsed = body.safeParse(req.body);
    if (!parsed.success) {
      errors.push({ type: 'body', errors: parsed.error });
    }
  }

  return errors;
};
