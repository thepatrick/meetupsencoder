import { isObject } from 'util';

export const isUsefulObject = (
  possible: unknown,
): possible is { [key: string]: unknown } => {
  return isObject(possible);
};
