import { loadJob } from './api/loadJob';
import { execAsync } from './execAsync';
import { log } from './log';
import { gsutilCopy } from './gsutilCopy';
import { isNil } from 'ramda';
import { setOrchestratorStatus } from './api/setOrchestratorStatus';
import { JobStatus } from './api/JobStatus';

(async () => {
  const jobURL = !isNil(process.env.MEW_JOB_URL)
    && process.env.MEW_JOB_URL.length > 0
    && process.env.MEW_JOB_URL;
  const secret = !isNil(process.env.MEW_SECRET)
    && process.env.MEW_SECRET.length > 0
    && process.env.MEW_SECRET;

  if (!(jobURL && secret)) {
    throw new Error('MEW_JOB_URL or MEW_SECRET not set');
  }

  const setStatus = setOrchestratorStatus(secret, jobURL);

  log('Starting job', { jobURL });

  const job = await loadJob(jobURL, secret);

  log('Job', job);

  setStatus(JobStatus.EncoderDownloading);

  for (const download of job.downloads) {
    await gsutilCopy(download.src, download.dest);
  }

  setStatus(JobStatus.Encoding);
  await execAsync('melt', job.meltCommand);

  setStatus(JobStatus.Uploading);
  for (const upload of job.uploads) {
    await gsutilCopy(upload.src, upload.dest);
  }

  setStatus(JobStatus.Finished);
})()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
