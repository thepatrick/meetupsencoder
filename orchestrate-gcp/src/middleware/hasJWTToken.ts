import { RequestHandler } from 'express';
import { isNil } from 'ramda';
import { ForbiddenError } from '../httpErrors/ForbiddenError';
import jsonwebtoken from 'jsonwebtoken';
import { isNonEmptyString } from '../utils/isNonEmptyString';

export const hasJWTToken: (secret: string, propName: string) => RequestHandler =
  (secret, propName) =>
    (req, res, next) => {

      const prop = req.params[propName];
      if (isNonEmptyString(prop)) {
        console.log(`Unexpected value for ${propName}: ${prop}`);
        next(new ForbiddenError());
        return;
      }

      const secretHeader = req.headers['x-mew-token'];
      if (isNil(secretHeader) || Array.isArray(secretHeader)) {
        next(new ForbiddenError());
        return;
      }

      try {
        jsonwebtoken.verify(
          secretHeader,
          secret,
          {
            algorithms: ['HS512'],
            subject: prop,
          },
        );
      } catch (err) {
        console.log('Failed to decode JWT', err);
        next(new ForbiddenError());
        return;
      }

      next();
    };
