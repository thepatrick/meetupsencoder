import { JobStatus, isValidJobStatus } from './JobStatus';
import { is, isNil, where } from 'ramda';
import { isNonEmptyString } from '../../utils/isNonEmptyString';
import { isString } from 'util';

export interface Job {
  jobId: string;
  bucket: string;
  fileName: string;
  cloudInitData: unknown;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  cloudInstanceName?: string;
  secret: string;
}

const isDate = (
  possible: unknown,
): possible is Date =>
  is(Date, possible);

const isUndefinedOrString = (
  possible: unknown,
): possible is string | undefined =>
  isNil(undefined) || isString(possible);

export const isValidJob = (
  possible: unknown,
): possible is Job => {
  return where(
    {
      jobId: isNonEmptyString,
      bucket: isNonEmptyString,
      fileName: isNonEmptyString,
      // cloudInitData:
      status: isValidJobStatus,
      createdAt: isDate,
      updatedAt: isDate,
      cloudInstanceName: isUndefinedOrString,
      secret: isNonEmptyString,
    },
    possible,
  );
};
