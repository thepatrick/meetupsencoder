import { where } from 'ramda';
import { isNonEmptyString } from './isNonEmptyString';

export interface GSUtilCopyJob {
  src: string;
  dest: string;
}

export const isGSUtilCopyJob = (possible: unknown): possible is GSUtilCopyJob => {
  return where(
    {
      src: isNonEmptyString,
      dest: isNonEmptyString,
    },
    possible,
  );
};
