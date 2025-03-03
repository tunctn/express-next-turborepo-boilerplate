import { HttpException } from "@/exceptions/http.exception";
import { ERROR } from "@/lib/errors";
import { logger } from "@/utils/logger/index";
import type { db } from "@packages/database";

export const transaction = async <T>(client: typeof db, fn: (txClient: typeof db) => Promise<T>): Promise<T> => {
  return client.transaction(async (tx) => {
    try {
      return await fn(tx as unknown as typeof db);
    } catch (e) {
      logger.error("Transaction error. Rollback.");
      try {
        tx.rollback();
      } catch (_txe) {}

      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }

      throw new HttpException(500, ERROR.GENERIC["unknown-error"]);
    }
  });
};
