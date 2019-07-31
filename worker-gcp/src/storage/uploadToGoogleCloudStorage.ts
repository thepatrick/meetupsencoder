import { Storage } from '@google-cloud/storage';

export const uploadToGoogleCloudStorage = async (
  storage: Storage,
  src: string,
  dest: string,
): Promise<void> => {
  const destURL = new URL(dest);
  const bucket = storage.bucket(destURL.host);

  const [, apiResponse] = await bucket.upload(src, {
    destination: destURL.pathname,
    resumable: false,
    validation: 'crc32c',
  });
};
