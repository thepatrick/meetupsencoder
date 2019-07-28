import nodeFetch from 'node-fetch';
import { curry } from 'ramda';
import { JobStatus } from './JobStatus';
import { createMEWTokenHeader } from './createMEWTokenHeader';

export const setOrchestratorStatus = curry(async (
  secret: string,
  jobURL: string,
  status: JobStatus,
): Promise<void> => {
  const response = await nodeFetch(
    `${jobURL}/status`,
    {
      method: 'POST',
      headers: {
        ...createMEWTokenHeader(`${jobURL}/status`, secret),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
      }),
    },
  );
  if (response.status > 400) {
    throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
  }
});
