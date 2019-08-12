import { JobStatus, isValidJobStatus } from './JobStatus';
import { is, isNil, where } from 'ramda';
import { isNonEmptyString } from '../../utils/isNonEmptyString';
import { isString } from 'util';
import { QueryResultRowType } from 'slonik';
import { dateFromTimestamp } from '../../utils/dateFromTimestamp';

export interface Job {
  jobId: string;
  bucket: string;
  fileName: string;
  cloudInitData: unknown;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  cloudInstanceName?: string;
}

const isDate = (
  possible: unknown,
): possible is Date =>
  is(Date, possible);

const isUndefinedOrString = (
  possible: unknown,
): possible is string | undefined =>
  isNil(undefined) || isString(possible);

export const jobFromQueryResultRow = (
  row: QueryResultRowType,
): Job => {
  const jobId = row.jobId;
  if (!isNonEmptyString(jobId)) {
    throw new Error('job.jobId is not a non empty string');
  }

  const bucket = row.bucket;
  if (!isNonEmptyString(bucket)) {
    throw new Error('job.bucket is not a non empty string');
  }

  const fileName = row.fileName;
  if (!isNonEmptyString(fileName)) {
    throw new Error('job.fileName is not a non empty string');
  }

  const status = row.status;
  if (!isValidJobStatus(status)) {
    throw new Error(`job.status is not a valid JobStatus ${status}`);
  }

  const createdAt = dateFromTimestamp(row.createdAt);
  const updatedAt = dateFromTimestamp(row.updatedAt);

  const cloudInstanceName = row.cloudInstanceName;
  if (!isUndefinedOrString(cloudInstanceName)) {
    throw new Error(`job.cloudInstanceName is not undefined or string ${cloudInstanceName}`);
  }

  return {
    jobId,
    bucket,
    fileName,
    status,
    createdAt,
    updatedAt,
    cloudInstanceName,
    cloudInitData: row.cloudInitData,
  };
};

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
    },
    possible,
  );
};
