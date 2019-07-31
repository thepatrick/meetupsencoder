import { RequestHandler } from 'express';
import { isNil } from 'ramda';
import { ForbiddenError } from '../httpErrors/ForbiddenError';

export const hasSecret: (secret: string) => RequestHandler = secret =>
  (req, res, next) => {
    const secretHeader = req.headers['x-meetups-encoder-secret'];
    if (isNil(secretHeader) || Array.isArray(secretHeader) || secretHeader !== secret) {
      next(new ForbiddenError());
    }
    next();
  };
