import { NOT_FOUND } from 'http-status-codes';
import { HttpResponseError } from './HttpResponseError';

export class NotFoundError extends HttpResponseError {
  constructor(message?: string) {
    super(NOT_FOUND, message);
  }
}
