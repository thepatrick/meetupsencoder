import { isEmpty, isString } from 'lodash';

export function isNonEmptyString(s: string) {
  return isString(s) && !isEmpty(s);
}
