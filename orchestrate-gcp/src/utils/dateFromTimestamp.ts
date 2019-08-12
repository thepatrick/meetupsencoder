import { isNumber } from 'util';

export const dateFromTimestamp = (
  possible: unknown,
): Date => {
  if (!isNumber(possible)) {
    throw new Error(`Timestamp is not a number ${possible}`);
  }

  return new Date(possible);
};
