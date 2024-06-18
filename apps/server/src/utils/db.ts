import { HttpException } from '@/exceptions/http.exception';
import { db } from '@/lib/db';
import { ERROR } from '@/lib/errors';
import { logger } from './logger';

export const transaction = async <T>(client: typeof db, fn: (txClient: typeof db) => Promise<T>): Promise<T> => {
  return client.transaction(async tx => {
    try {
      return await fn(tx);
    } catch (e) {
      logger.error(e);
      try {
        tx.rollback();
      } catch (e) {
        logger.error(e);
      }

      if (e instanceof HttpException) {
        throw e;
      }

      throw new HttpException(500, ERROR.GENERIC['unknown-error']);
    }
  });
};
