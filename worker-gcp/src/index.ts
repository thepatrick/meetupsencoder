import { Storage } from '@google-cloud/storage';
import pino from 'pino';
import { isNonEmptyString } from './api/isNonEmptyString';
import { JobStatus } from './api/JobStatus';
import { loadJob } from './api/loadJob';
import { sendOrchestratorLog } from './api/sendOrchestratorLog';
import { setOrchestratorStatus } from './api/setOrchestratorStatus';
import { melt } from './melt';
import { downloadFromGoogleCloudStorage } from './storage/downloadFromGoogleCloudStorage';
import { uploadToGoogleCloudStorage } from './storage/uploadToGoogleCloudStorage';

const storage = new Storage();
const logger = pino();

(async () => {
  const jobURL = process.env.MEW_JOB_URL;
  const orchestratorToken = process.env.MEW_ORCHESTRATOR_TOKEN;

  if (!(isNonEmptyString(jobURL) && isNonEmptyString(orchestratorToken))) {
    throw new Error('MEW_JOB_URL or MEW_ORCHESTRATOR_TOKEN not set');
  }

  const sendLog = sendOrchestratorLog(
    orchestratorToken,
    jobURL,
  );

  const setStatus = setOrchestratorStatus(
    logger.child({ module: 'setOrchestratorStatus' }),
    orchestratorToken,
    jobURL,
  );

  sendLog(logger, 'info', 'Starting job', { jobURL });

  let job;
  try {
    job = await loadJob(jobURL, orchestratorToken);
  } catch (err) {
    logger.error('Problem fetching Job', err);
    await setStatus(JobStatus.Failed);
    throw err;
  }

  sendLog(logger, 'info', 'Got Job', job);

  await setStatus(JobStatus.EncoderDownloading);

  for (const download of job.downloads) {
    sendLog(logger, 'info', `Downloading ${download.src}`);
    try {
      await downloadFromGoogleCloudStorage(
        storage,
        sendLog(logger),
        download.src,
        download.dest,
      );
    } catch (err) {
      sendLog(logger, 'error', `Problem downloading ${download.src}`, { err: err.message });
      await setStatus(JobStatus.Failed);
      throw err;
    }
  }

  await setStatus(JobStatus.Encoding);
  try {
    sendLog(logger, 'info', 'Starting melt');
    await melt(sendLog(logger), job.meltCommand);
  } catch (err) {
    logger.error('Problem encoding', { err: err.message });
    await setStatus(JobStatus.Failed);
    throw err;
  }
  sendLog(logger, 'info', 'Melt complete');

  await setStatus(JobStatus.Uploading);
  for (const upload of job.uploads) {
    sendLog(logger, 'info', 'Uploading', upload);
    try {
      await uploadToGoogleCloudStorage(
        storage,
        upload.src,
        upload.dest,
      );
    } catch (err) {
      sendLog(logger, 'error', `Problem uploading ${upload.src}`, { err: err.message });
      await setStatus(JobStatus.Failed);
      throw err;
    }
  }
  sendLog(logger, 'info', 'Upload finished');

  await setStatus(JobStatus.Finished);
})()
  .catch((e: Error) => {
    logger.error(`Final catch: ${e.message}`, e);
    process.exit(1);
  });
