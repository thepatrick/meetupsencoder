import { getStatusText } from 'http-status-codes';
import { is } from 'ramda';
import { UnauthorizedError } from 'express-jwt';

export class HttpResponseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message || getStatusText(statusCode));
    this.statusCode = statusCode;
  }
}

export const isHttpResponseError = (possible: unknown): possible is HttpResponseError => {
  return is(HttpResponseError, possible);
};

export const isJWTUnauthorisedError = (possible: unknown): possible is UnauthorizedError => {
  return is(UnauthorizedError, possible);
};
