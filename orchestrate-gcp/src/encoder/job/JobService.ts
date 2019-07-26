import Compute from '@google-cloud/compute';
import { Storage } from '@google-cloud/storage';
import shortid from 'shortid';
import { JobSubmission } from './JobSubmission';
import { commandFromJob } from '../commandFromJob';
import nanoid from 'nanoid';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { Job, isValidJob } from './Job';
import { JobStatus } from './JobStatus';
import { enqueueCreate } from '../WorkerQueue/enqueueWorkerCreate';

export const insertJobWithSubmission = async (
  storage: Storage,
  bucket: string,
  connection: DatabasePoolConnectionType,
  jobSubmission: JobSubmission,
): Promise<string> => {
  const id = shortid.generate();
  const fileName = `encodes/${id}/${jobSubmission.fileName}.mp4`;
  const jobFile = await commandFromJob(
    storage,
    bucket,
    fileName,
    jobSubmission,
  );
  const secret = nanoid(48);

  await connection.query(sql`
  INSERT INTO job (
    job_id,
    bucket,
    file_name,
    cloud_init_data,
    status,
    created_at,
    updated_at,
    cloud_instance_name,
    secret
  ) VALUES (
    ${id},
    ${bucket},
    ${fileName},
    ${jobFile},
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
      bucket,
      file_name,
      cloud_init_data,
      status,
      created_at,
      updated_at,
      cloud_instance_name,
      secret
    FROM
      job
    WHERE
      job_id = ${jobId}
  `);

  const possibleJob = {
    jobId,
    bucket: row.bucket,
    status: row.status,
    secret: row.secret,
    fileName: row.file_name,
    cloudInitData: row.cloud_init_data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    cloudInstanceName: row.cloud_instance_name,
  };

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
      cloud_instance_name: ${cloudInstanceName},
      updated_at = NOW()
    WHERE job_id = ${jobId}
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
      updated_at = NOW()
    WHERE job_id = ${jobId}
  `);
};
