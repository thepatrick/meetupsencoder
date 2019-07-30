import { Storage } from '@google-cloud/storage';
import { sendOrchestratorLogger } from '../api/sendOrchestratorLog';

export const uploadToGoogleCloudStorage = async (
  storage: Storage,
  logger: sendOrchestratorLogger,
  src: string,
  dest: string,
): Promise<void> => {
  const destURL = new URL(dest);
  const bucket = storage.bucket(destURL.host);

  logger('info', 'Uploading', { src, dest });
  const [, apiResponse] = await bucket.upload(src, {
    destination: destURL.pathname,
    resumable: true,
    validation: 'crc32c',
  });

  logger('info', 'Upload complete', { dest, apiResponse });
};
