import { ErrorMessage } from '@/lib/errors';

export class HttpException extends Error {
  public status: number;
  public errorMessage: ErrorMessage;

  constructor(status: number, errorMessage: ErrorMessage) {
    super('Unknown error');
    this.status = status;
    this.errorMessage = errorMessage;
  }
}
