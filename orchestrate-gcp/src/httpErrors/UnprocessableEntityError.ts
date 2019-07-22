import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { HttpResponseError } from './HttpResponseError';

export class UnprocessableEntityError extends HttpResponseError {
  constructor(message?: string) {
    super(UNPROCESSABLE_ENTITY, message);
  }
}
