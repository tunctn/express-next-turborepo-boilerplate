import { HttpException } from "@/exceptions/http.exception";
import { ERROR } from "@/lib/errors";
import { createErrorBody } from "@/lib/errors/_create-error-body";
import { logger } from "@/utils/logger";
import type { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (e: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    let error = e as HttpException;
    const originalError = error as any;
    if (originalError?.["type"] === "entity.parse.failed") {
      error = new HttpException(400, ERROR.GENERIC["invalid-json"]);
    }

    const { status, body } = createErrorBody(error, req);
    logger.error(
      `[${req.method}] ${req.path} >> ErrorMiddleware :: StatusCode:: ${status}, Message:: ${JSON.stringify(originalError, null, 2)}`,
    );
    res.status(status).json(body);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
