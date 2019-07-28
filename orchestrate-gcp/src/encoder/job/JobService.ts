import { Storage } from '@google-cloud/storage';
import nanoid from 'nanoid';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { encoderConfigurationFromJobSubmission } from './encoderConfigurationFromJobSubmission';
import { enqueueCreate } from '../WorkerQueue/enqueueWorkerCreate';
import { Job, jobFromQueryResultRow } from './Job';
import { JobStatus } from './JobStatus';
import { JobSubmission } from './JobSubmission';

export const insertJobWithSubmission = async (
  storage: Storage,
  bucket: string,
  connection: DatabasePoolConnectionType,
  jobSubmission: JobSubmission,
): Promise<string> => {
  const id = nanoid(16);
  const fileName = `encodes/${id}/${jobSubmission.fileName}.mp4`;

  const encoderConfiguration = await encoderConfigurationFromJobSubmission(
    storage,
    bucket,
    fileName,
    jobSubmission,
  );

  await connection.query(sql`
  INSERT INTO job (
    "jobId",
    "bucket",
    "fileName",
    "cloudInitData",
    "status",
    "createdAt",
    "updatedAt",
    "cloudInstanceName"
  ) VALUES (
    ${id},
    ${bucket},
    ${fileName},
    ${encoderConfiguration},
    ${JobStatus.NeedsEncoder},
    now(),
    now(),
    NULL
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
      "cloudInstanceName"
    FROM
      job
    WHERE
      "jobId" = ${jobId}
  `);

  // const possibleJob = pick(
  //   [
  //     'jobId',
  //     'bucket',
  //     'status',
  //     'fileName',
  //     'cloudInitData',
  //     'createdAt',
  //     'updatedAt',
  //     'cloudInstanceName',
  //   ],
  //   row,
  // );

  return jobFromQueryResultRow(row);

  // if (!isValidJob(possibleJob)) {
  //   console.log('possibleJob', possibleJob, 'was deemed invalid :(');
  //   throw new Error('Cannot deserialize Job');
  // }

  // return possibleJob;
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
