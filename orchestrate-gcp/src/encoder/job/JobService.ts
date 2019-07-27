import { Storage } from '@google-cloud/storage';
import nanoid from 'nanoid';
import { pick } from 'ramda';
import shortid from 'shortid';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { encoderConfigurationFromJobSubmission } from './encoderConfigurationFromJobSubmission';
import { enqueueCreate } from '../WorkerQueue/enqueueWorkerCreate';
import { isValidJob, Job } from './Job';
import { JobStatus } from './JobStatus';
import { JobSubmission } from './JobSubmission';

export const insertJobWithSubmission = async (
  storage: Storage,
  bucket: string,
  connection: DatabasePoolConnectionType,
  jobSubmission: JobSubmission,
): Promise<string> => {
  const id = shortid.generate();
  const fileName = `encodes/${id}/${jobSubmission.fileName}.mp4`;

  const encoderConfiguration = await encoderConfigurationFromJobSubmission(
    storage,
    bucket,
    fileName,
    jobSubmission,
  );
  const secret = nanoid(48);

  await connection.query(sql`
  INSERT INTO job (
    "jobId",
    "bucket",
    "fileName",
    "cloudInitData",
    "status",
    "createdAt",
    "updatedAt",
    "cloudInstanceName",
    "secret"
  ) VALUES (
    ${id},
    ${bucket},
    ${fileName},
    ${encoderConfiguration},
    ${JobStatus.NeedsEncoder},
    now(),
    now(),
    NULL,
    ${secret}
  )
`);

  await enqueueCreate(connection, id);

  return id;
};

export const getJob = async (
  connection: DatabasePoolConnectionType,
  jobId: string,
): Promise<Job> => {
  const row = await connection.one(sql`
    SELECT
      "jobId",
      "bucket",
      "fileName",
      "cloudInitData",
      "status",
      "createdAt",
      "updatedAt",
      "cloudInstanceName",
      "secret"
    FROM
      job
    WHERE
      "jobId" = ${jobId}
  `);

  const possibleJob = pick(
    [
      'jobId',
      'bucket',
      'status',
      'secret',
      'fileName',
      'cloudInitData',
      'createdAt',
      'updatedAt',
      'cloudInstanceName',
    ],
    row,
  );

  if (!isValidJob(possibleJob)) {
    throw new Error('Cannot deserialize Job');
  }

  return possibleJob;
};

export const updateJobInstanceName = async (
  connection: DatabasePoolConnectionType,
  jobId: string,
  cloudInstanceName: string,
  status: JobStatus,
): Promise<void> => {
  await connection.query(sql`
    UPDATE job
    SET
      status = ${status},
      "cloudInstanceName": ${cloudInstanceName},
      "updatedAt" = NOW()
    WHERE "jobId" = ${jobId}
  `);
};

export const updateJobStatus = async (
  connection: DatabasePoolConnectionType,
  jobId: string,
  status: JobStatus,
): Promise<void> => {
  await connection.query(sql`
    UPDATE job
    SET
      status = ${status},
      "updatedAt" = NOW()
    WHERE "jobId" = ${jobId}
  `);
};
