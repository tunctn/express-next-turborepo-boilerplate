import { HttpException } from '@/exceptions/http.exception';
import { ERROR } from '@/lib/errors';
import { createErrorBody } from '@/lib/errors/_create-error-body';
import { logger } from '@/utils/logger';
import type { NextFunction, Request, Response } from 'express';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const anyError = error as any;
    if (anyError.type === 'entity.parse.failed') {
      error = new HttpException(400, ERROR.GENERIC['invalid-json']);
    }

    const { status, body, originalError } = createErrorBody(error, req);
    logger.error(
      `[${req.method}] ${req.path} >> ErrorMiddleware :: StatusCode:: ${status}, Message:: ${JSON.stringify(originalError, null, 2)}`
    );
    res.status(status).json(body);
  } catch (error) {
    next(error);
  }
};
