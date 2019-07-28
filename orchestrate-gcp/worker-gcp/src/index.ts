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
  const orchestratorToken = !isNil(process.env.MEW_ORCHESTRATOR_TOKEN)
    && process.env.MEW_ORCHESTRATOR_TOKEN.length > 0
    && process.env.MEW_ORCHESTRATOR_TOKEN;

  if (!(jobURL && orchestratorToken)) {
    throw new Error('MEW_JOB_URL or MEW_ORCHESTRATOR_TOKEN not set');
  }

  const setStatus = setOrchestratorStatus(orchestratorToken, jobURL);

  log('Starting job', { jobURL });

  const job = await loadJob(jobURL, orchestratorToken);

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
