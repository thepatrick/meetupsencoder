import { FORBIDDEN } from 'http-status-codes';
import { HttpResponseError } from './HttpResponseError';

export class ForbiddenError extends HttpResponseError {
  constructor() {
    super(FORBIDDEN);
  }
}
