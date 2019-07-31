import { Storage } from '@google-cloud/storage';
import { sendOrchestratorLogger } from '../api/sendOrchestratorLog';

export const downloadFromGoogleCloudStorage = async (
  storage: Storage,
  logger: sendOrchestratorLogger,
  src: string,
  dest: string,
): Promise<void> => {
  const srcURL = new URL(src);

  const bucket = storage.bucket(srcURL.host);
  const file = bucket.file(srcURL.pathname);

  logger('trace', 'downloadFromGoogleCloudStorage', { src, dest });
  await file.download({
    destination: dest,
  });
};
