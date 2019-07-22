import { where } from 'ramda';
import { isNonEmptyString } from '../../utils/isNonEmptyString';

export type JobClip = [string, string];

export const isValidJobClip = (
  possible: unknown,
): possible is JobClip => {
  return Array.isArray(possible) &&
    where(
      {
        0: isNonEmptyString,
        1: isNonEmptyString,
      },
      possible,
    );
};
