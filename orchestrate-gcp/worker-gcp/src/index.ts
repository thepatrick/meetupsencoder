import { isNonEmptyString } from './api/isNonEmptyString';
import { JobStatus } from './api/JobStatus';
import { loadJob } from './api/loadJob';
import { setOrchestratorStatus } from './api/setOrchestratorStatus';
import { execAsync } from './execAsync';
import { gsutilCopy } from './gsutilCopy';
import pino from 'pino';

const logger = pino();

(async () => {
  const jobURL = process.env.MEW_JOB_URL;
  const orchestratorToken = process.env.MEW_ORCHESTRATOR_TOKEN;

  if (!(isNonEmptyString(jobURL) && isNonEmptyString(orchestratorToken))) {
    throw new Error('MEW_JOB_URL or MEW_ORCHESTRATOR_TOKEN not set');
  }

  const setStatus = setOrchestratorStatus(
    logger.child({ module: 'setOrchestratorStatus' }),
    orchestratorToken,
    jobURL,
  );

  logger.info('Starting job', { jobURL });

  let job;
  try {
    job = await loadJob(jobURL, orchestratorToken);
  } catch (err) {
    logger.error('Problem fetching Job', err);
    await setStatus(JobStatus.Failed);
    throw err;
  }

  logger.info('Job', { job });

  await setStatus(JobStatus.EncoderDownloading);

  for (const download of job.downloads) {
    logger.info('Downloading', download);
    try {
      await gsutilCopy(logger, download.src, download.dest);
    } catch (err) {
      logger.error(`Problem downloading ${download.src}`, { err });
      await setStatus(JobStatus.Failed);
      throw err;
    }
  }

  await setStatus(JobStatus.Encoding);
  try {
    await execAsync(logger, 'melt', job.meltCommand);
  } catch (err) {
    logger.error('Problem encoding', { err });
    await setStatus(JobStatus.Failed);
    throw err;
  }

  await setStatus(JobStatus.Uploading);
  for (const upload of job.uploads) {
    logger.info('Uploading', { upload });
    try {
      await gsutilCopy(logger, upload.src, upload.dest);
    } catch (err) {
      logger.error(`Problem uploading ${upload.src}`, { err });
      await setStatus(JobStatus.Failed);
      throw err;
    }
  }

  await setStatus(JobStatus.Finished);
})()
  .catch((e: Error) => {
    logger.error(`Final catch: ${e.message}`, e);
    process.exit(1);
  });
