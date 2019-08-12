import { filter } from 'ramda';
import { isNonEmptyString } from '../utils/isNonEmptyString';
import { dateFromTimestamp } from '../utils/dateFromTimestamp';
import { isUsefulObject } from '../utils/isUsefulObject';

export interface JWTUser {
  iss: string;   // 'https://twopats.au.auth0.com/',
  sub: string;   // 'github|7331'
  aud: string[]; // ['https://crofter-api.twopats.live/', ...]
  permissions: string[]; //  [ 'group:add', 'video:create', 'video:play' ]
}

export const jwtUserFromRequestUser = (
  possible: unknown,
): JWTUser => {

  if (!isUsefulObject(possible)) {
    throw new Error('User is undefined');
  }

  const {
    iss,
    sub,
    aud,
    permissions,
  } = possible;

  if (!isNonEmptyString(iss)) {
    throw new Error('user.iss is not a non empty string');
  }

  if (!isNonEmptyString(sub)) {
    throw new Error('user.sub is not a non empty string');
  }

  if (!Array.isArray(aud)) {
    throw new Error('user.aud is not an array');
  }
  if (!filter(isNonEmptyString, aud)) {
    console.log('aud is', aud);
    throw new Error('user.aud is not an array of non empty strings');
  }

  return {
    iss,
    sub,
    aud,
    permissions: Array.isArray(permissions) && filter(isNonEmptyString, permissions) || [],
  };
};
