import { EncoderJob, isEncoderJob } from './EncoderJob';
import nodeFetch from 'node-fetch';
import { createMEWTokenHeader } from './createMEWTokenHeader';

export const loadJob = async (
  jobURL: string,
  secret: string,
): Promise<EncoderJob> => {
  const response = await nodeFetch(
    `${jobURL}/config`,
    {
      method: 'GET',
      headers: createMEWTokenHeader(`${jobURL}/config`, secret),
    },
  );

  if (response.status > 400) {
    throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
  }

  const possibleEncoderJob = await response.json();

  if (!isEncoderJob(possibleEncoderJob)) {
    throw new Error('Job is not valid');
  }

  return possibleEncoderJob;
};
