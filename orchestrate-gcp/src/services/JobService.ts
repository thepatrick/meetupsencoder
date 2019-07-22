import Compute from '@google-cloud/compute';
import { Storage } from '@google-cloud/storage';
import shortid from 'shortid';
import { JobSubmission } from '../encoder/job/Job';
import { commandFromJob } from '../encoder/commandFromJob';
import nanoid from 'nanoid';
import { insertJob } from '../db/insertJob';
import { DatabasePoolConnectionType } from 'slonik';
import { createCloudWorker } from '../encoder/createCloudWorker';

export const insertJobWithSubmission = async (
  compute: Compute,
  storage: Storage,
  selfUrl: string,
  bucket: string,
  connection: DatabasePoolConnectionType,
  jobSubmission: JobSubmission,
): Promise<string> => {
  const id = shortid.generate();
  const fileName = `encodes/${id}/${jobSubmission.fileName}.mp4`;
  const jobFile = await commandFromJob(storage, {
    bucket,
    fileName,
    encoderId: jobSubmission.encoderId,
    clips: jobSubmission.clips,
    fps: jobSubmission.fps,
    profile: jobSubmission.profile,
  });
  const secret = nanoid(48);

  await insertJob(connection, id, bucket, fileName, jobFile, secret);

  const instanceId = await createCloudWorker(
    compute,
    selfUrl,
    id,
    secret,
  );

  return id;

};
